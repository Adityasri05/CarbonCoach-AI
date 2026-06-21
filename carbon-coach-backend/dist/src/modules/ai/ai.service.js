"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const genai_1 = require("@google/genai");
let AIService = class AIService {
    prisma;
    ai;
    constructor(prisma) {
        this.prisma = prisma;
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    async generateRecommendations(userId) {
        const habits = await this.prisma.habits.findUnique({ where: { userId } });
        if (!habits)
            return [];
        const recommendations = [];
        if (habits.vehicleType === 'Gasoline' || habits.vehicleType === 'Diesel') {
            const co2Saving = Math.round(habits.travelDistance * 52 * 0.18 * 3);
            recommendations.push({
                category: client_1.ActivityCategory.TRANSPORTATION,
                text: `Using public transport 3 days/week instead of your ${habits.vehicleType} car could save ~${co2Saving} kg CO₂ annually.`,
                co2SavingEstimate: co2Saving,
            });
        }
        if (habits.acUsage > 2) {
            const acSaving = Math.round(habits.acUsage * 365 * 0.5 * 0.3);
            recommendations.push({
                category: client_1.ActivityCategory.ENERGY,
                text: `Reducing your AC runtime by 1 hour daily can save roughly ~${acSaving} kg CO₂ annually.`,
                co2SavingEstimate: acSaving,
            });
        }
        if (habits.foodHabit === 'Non-Vegetarian') {
            recommendations.push({
                category: client_1.ActivityCategory.FOOD,
                text: 'Swapping beef or pork for a plant-based meal twice a week saves ~140 kg CO₂ annually.',
                co2SavingEstimate: 140,
            });
        }
        if (habits.recyclingHabits !== 'Always') {
            recommendations.push({
                category: client_1.ActivityCategory.WASTE,
                text: 'Sorting and recycling 100% of your packaging materials avoids up to ~80 kg CO₂ annually in landfills.',
                co2SavingEstimate: 80,
            });
        }
        await this.prisma.$transaction(recommendations.map((rec) => this.prisma.recommendation.create({
            data: {
                userId,
                category: rec.category,
                text: rec.text,
                co2SavingEstimate: rec.co2SavingEstimate,
            },
        })));
        return recommendations;
    }
    async chatbotResponse(userId, userMessage) {
        const habits = await this.prisma.habits.findUnique({ where: { userId } });
        const pastHistory = await this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 10,
        });
        const sortedHistory = [...pastHistory].reverse();
        await this.prisma.chatHistory.create({
            data: {
                userId,
                sender: 'USER',
                text: userMessage,
            },
        });
        const systemInstruction = `You are CarbonCoach AI, an enthusiastic, knowledgeable sustainability coach.
Your job is to help users track, simulate, and reduce their carbon footprint.
Be encouraging, professional, and actionable. Use markdown for lists/bolding where helpful.
${habits
            ? `User Profile Info:
- Vehicle Type: ${habits.vehicleType || 'None'}
- Monthly Travel Distance: ${habits.travelDistance || 0} km
- Monthly Electricity Bill: $${habits.electricityBill || 0}
- AC Usage Daily: ${habits.acUsage || 0} hours
- Food Habit: ${habits.foodHabit || 'Unknown'}
- Shopping Frequency: ${habits.shoppingFrequency || 'Unknown'}
- Recycling Habits: ${habits.recyclingHabits || 'Unknown'}`
            : 'User Profile Info: No profile habits created yet.'}`;
        const contents = sortedHistory.map((h) => ({
            role: h.sender === 'USER' ? 'user' : 'model',
            parts: [{ text: h.text }],
        }));
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
        }
        catch (error) {
            console.error('Gemini API Error, falling back to rule-based response:', error);
            botReply =
                "That's an insightful question. Reducing emissions starts with understanding utility grids and transport efficiencies. Would you like to check your AI Carbon Twin simulation?";
            const lower = userMessage.toLowerCase();
            if (lower.includes('how can i reduce') ||
                lower.includes('ways to reduce')) {
                botReply =
                    'To lower your carbon footprint: \n1. Optimize your AC (set temperature to 25°C).\n2. Reduce red meat meals (beef has a high carbon lifecycle cost).\n3. Transition to public transport, hybrid, or EV travel.';
            }
            else if (lower.includes('cycling') || lower.includes('bike')) {
                botReply =
                    'Cycling generates 0g CO₂/km compared to ~180g/km of gasoline cars. Over a year, cycling just 10km daily offsets ~650 kg CO₂!';
            }
            else if (lower.includes('flight') || lower.includes('plane')) {
                botReply =
                    'A single flight emits substantial emissions. A domestic round-trip average is ~0.8 to 1.2 Tons of CO₂ per passenger. Reducing flights in favor of trains or virtual syncs is highly carbon-effective.';
            }
        }
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
    async getChatHistory(userId) {
        return this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'asc' },
            take: 50,
        });
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIService);
//# sourceMappingURL=ai.service.js.map