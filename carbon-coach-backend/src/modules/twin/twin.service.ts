import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwinService {
  constructor(private prisma: PrismaService) {}

  async simulate(
    userId: string,
    scenarioName: string,
    transportSlider: number, // public transport days/week (0-7)
    energySlider: number, // monthly electricity bill ($50 - $600)
    foodSlider: string, // Vegan, Vegetarian, Eggetarian, Non-Vegetarian
    flightsSlider: number, // flights/year (0-12)
  ) {
    // 1. Fetch current baseline carbon score
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { habits: true },
    });

    const currentScore = 6.2; // Baseline default

    // 2. Perform future simulation math
    const simulatedTransport = ((7 - transportSlider) * 52 * 8) / 1000;
    const simulatedEnergy =
      (energySlider * 12 * 7 * 0.4) / 1000 + (365 * 0.5 * 2) / 1000; // simulated ac default

    let simulatedFood = 2.1;
    if (foodSlider === 'Vegan') simulatedFood = 0.6;
    else if (foodSlider === 'Vegetarian') simulatedFood = 0.9;
    else if (foodSlider === 'Eggetarian') simulatedFood = 1.1;

    const simulatedFlights = flightsSlider * 0.9;
    const wasteShoppingBaseline = 1.1; // Baseline waste/shopping

    const simulatedScore = parseFloat(
      (
        simulatedTransport +
        simulatedEnergy +
        simulatedFood +
        simulatedFlights +
        wasteShoppingBaseline
      ).toFixed(1),
    );

    const savingPercentage = Math.max(
      0,
      Math.round(((currentScore - simulatedScore) / currentScore) * 100),
    );

    // 3. Save simulation details
    const simulation = await this.prisma.carbonTwinSimulation.create({
      data: {
        userId,
        scenarioName,
        transportSlider,
        energySlider,
        foodSlider,
        flightsSlider,
        currentScore,
        simulatedScore,
      },
    });

    return {
      simulation,
      savingPercentage,
      co2SavedTons: parseFloat((currentScore - simulatedScore).toFixed(2)),
    };
  }

  async getHistory(userId: string) {
    return this.prisma.carbonTwinSimulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
