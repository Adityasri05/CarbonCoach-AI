import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityCategory } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AIService {
  private ai: GoogleGenAI;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateRecommendations(userId: string) {
    const habits = await this.prisma.habits.findUnique({ where: { userId } });
    if (!habits) return [];

    const recommendations = [];

    // Rule-based engine (Phase 1) that generates structured tips
    if (habits.vehicleType === 'Gasoline' || habits.vehicleType === 'Diesel') {
      const co2Saving = Math.round(habits.travelDistance * 52 * 0.18 * 3); // 3 days/week saving
      recommendations.push({
        category: ActivityCategory.TRANSPORTATION,
        text: `Using public transport 3 days/week instead of your ${habits.vehicleType} car could save ~${co2Saving} kg CO₂ annually.`,
        co2SavingEstimate: co2Saving,
      });
    }

    if (habits.acUsage > 2) {
      const acSaving = Math.round(habits.acUsage * 365 * 0.5 * 0.3); // 30% reduction runtime saving
      recommendations.push({
        category: ActivityCategory.ENERGY,
        text: `Reducing your AC runtime by 1 hour daily can save roughly ~${acSaving} kg CO₂ annually.`,
        co2SavingEstimate: acSaving,
      });
    }

    if (habits.foodHabit === 'Non-Vegetarian') {
      recommendations.push({
        category: ActivityCategory.FOOD,
        text: 'Swapping beef or pork for a plant-based meal twice a week saves ~140 kg CO₂ annually.',
        co2SavingEstimate: 140,
      });
    }

    if (habits.recyclingHabits !== 'Always') {
      recommendations.push({
        category: ActivityCategory.WASTE,
        text: 'Sorting and recycling 100% of your packaging materials avoids up to ~80 kg CO₂ annually in landfills.',
        co2SavingEstimate: 80,
      });
    }

    // Save recommendations in PostgreSQL for this user
    await this.prisma.$transaction(
      recommendations.map((rec) =>
        this.prisma.recommendation.create({
          data: {
            userId,
            category: rec.category,
            text: rec.text,
            co2SavingEstimate: rec.co2SavingEstimate,
          },
        }),
      ),
    );

    return recommendations;
  }

  async chatbotResponse(userId: string, userMessage: string) {
    // Retrieve user habits for context
    const habits = await this.prisma.habits.findUnique({ where: { userId } });

    // Retrieve recent chat history for context (last 10 turns)
    const pastHistory = await this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    const sortedHistory = [...pastHistory].reverse();

    // 1. Log chat history in Postgres
    await this.prisma.chatHistory.create({
      data: {
        userId,
        sender: 'USER',
        text: userMessage,
      },
    });

    // 2. Process query with Gemini API
    const systemInstruction = `You are CarbonCoach AI, an enthusiastic, knowledgeable sustainability coach.
Your job is to help users track, simulate, and reduce their carbon footprint.
Be encouraging, professional, and actionable. Use markdown for lists/bolding where helpful.
${
  habits
    ? `User Profile Info:
- Vehicle Type: ${habits.vehicleType || 'None'}
- Monthly Travel Distance: ${habits.travelDistance || 0} km
- Monthly Electricity Bill: $${habits.electricityBill || 0}
- AC Usage Daily: ${habits.acUsage || 0} hours
- Food Habit: ${habits.foodHabit || 'Unknown'}
- Shopping Frequency: ${habits.shoppingFrequency || 'Unknown'}
- Recycling Habits: ${habits.recyclingHabits || 'Unknown'}`
    : 'User Profile Info: No profile habits created yet.'
}`;

    const contents = sortedHistory.map((h) => ({
      role: h.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    let botReply = '';
    try {
      const response = await this.ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
      botReply =
        response.text ||
        "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error(
        'Gemini API Error, falling back to rule-based response:',
        error,
      );
      // Fallback RAG / rule-based response
      botReply =
        "That's an insightful question. Reducing emissions starts with understanding utility grids and transport efficiencies. Would you like to check your AI Carbon Twin simulation?";
      const lower = userMessage.toLowerCase();
      if (
        lower.includes('how can i reduce') ||
        lower.includes('ways to reduce')
      ) {
        botReply =
          'To lower your carbon footprint: \n1. Optimize your AC (set temperature to 25°C).\n2. Reduce red meat meals (beef has a high carbon lifecycle cost).\n3. Transition to public transport, hybrid, or EV travel.';
      } else if (lower.includes('cycling') || lower.includes('bike')) {
        botReply =
          'Cycling generates 0g CO₂/km compared to ~180g/km of gasoline cars. Over a year, cycling just 10km daily offsets ~650 kg CO₂!';
      } else if (lower.includes('flight') || lower.includes('plane')) {
        botReply =
          'A single flight emits substantial emissions. A domestic round-trip average is ~0.8 to 1.2 Tons of CO₂ per passenger. Reducing flights in favor of trains or virtual syncs is highly carbon-effective.';
      }
    }

    // 3. Save Bot reply in database
    await this.prisma.chatHistory.create({
      data: {
        userId,
        sender: 'BOT',
        text: botReply,
      },
    });

    return {
      reply: botReply,
      timestamp: new Date(),
    };
  }

  async getChatHistory(userId: string) {
    return this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'asc' },
      take: 50,
    });
  }
}
