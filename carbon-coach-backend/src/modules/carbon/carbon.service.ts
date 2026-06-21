import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityCategory } from '@prisma/client';

@Injectable()
export class CarbonService {
  constructor(private prisma: PrismaService) {}

  // EPA and DEFRA based carbon footprint factors
  private readonly TRANSPORT_FACTORS = {
    Gasoline: 0.18, // kg CO2 per km
    Diesel: 0.2,
    Hybrid: 0.09,
    Electric: 0.04,
    None: 0.02, // Public transit average
  };

  private readonly FOOD_ANNUAL_TONS = {
    Vegan: 0.6,
    Vegetarian: 0.9,
    Eggetarian: 1.1,
    'Non-Vegetarian': 2.1,
  };

  private readonly SHOPPING_ANNUAL_TONS = {
    Daily: 1.2,
    Weekly: 0.8,
    Monthly: 0.4,
    Rarely: 0.1,
  };

  private readonly WASTE_ANNUAL_TONS = {
    Never: 0.8,
    Sometimes: 0.5,
    Always: 0.3,
  };

  async calculateAnnualFootprint(userId: string): Promise<number> {
    const habits = await this.prisma.habits.findUnique({
      where: { userId },
    });

    if (!habits) return 6.2; // Return global baseline if no habits profile exists yet

    // 1. Transportation score (Tons/yr)
    const factorKey =
      (habits.vehicleType as keyof typeof this.TRANSPORT_FACTORS) || 'Gasoline';
    const transportFactor = this.TRANSPORT_FACTORS[factorKey] || 0.18;
    const transportTons =
      (habits.travelDistance * 365 * transportFactor) / 1000;

    // 2. Home Energy (Tons/yr)
    // Electricity: assuming $1 USD = 7 kWh and 0.4 kg CO2 per kWh
    const electricityTons = (habits.electricityBill * 12 * 7 * 0.4) / 1000;
    const acTons = (habits.acUsage * 365 * 0.5) / 1000; // 0.5 kg CO2 per hour AC runtime
    const energyTons = electricityTons + acTons;

    // 3. Food (Tons/yr)
    const foodKey =
      (habits.foodHabit as keyof typeof this.FOOD_ANNUAL_TONS) ||
      'Non-Vegetarian';
    const foodTons = this.FOOD_ANNUAL_TONS[foodKey] || 2.1;

    // 4. Shopping (Tons/yr)
    const shoppingKey =
      (habits.shoppingFrequency as keyof typeof this.SHOPPING_ANNUAL_TONS) ||
      'Monthly';
    const shoppingTons = this.SHOPPING_ANNUAL_TONS[shoppingKey] || 0.4;

    // 5. Waste (Tons/yr)
    const wasteKey =
      (habits.recyclingHabits as keyof typeof this.WASTE_ANNUAL_TONS) ||
      'Sometimes';
    const wasteTons = this.WASTE_ANNUAL_TONS[wasteKey] || 0.5;

    const total = parseFloat(
      (
        transportTons +
        energyTons +
        foodTons +
        shoppingTons +
        wasteTons
      ).toFixed(1),
    );
    return total;
  }

  async logActivity(
    userId: string,
    activityType: string,
    quantity: number,
    unit: string,
  ) {
    let emissionsCalculated = 0;

    // Fast EPA carbon lookup by activity class
    if (activityType === 'car_trip') {
      emissionsCalculated = quantity * 0.18; // 180g/km gasoline average
    } else if (activityType === 'electricity_usage') {
      emissionsCalculated = quantity * 0.4; // 400g/kWh average
    } else if (activityType === 'meat_meal') {
      emissionsCalculated = quantity * 2.5; // 2.5kg per meat-heavy meal
    } else {
      emissionsCalculated = quantity * 0.1; // Baseline fallback
    }

    emissionsCalculated = parseFloat(emissionsCalculated.toFixed(2));

    const category = this.mapActivityToCategory(activityType);

    return this.prisma.$transaction(async (tx) => {
      // Create detailed activity log
      const log = await tx.activityLog.create({
        data: {
          userId,
          activityType,
          quantity,
          unit,
          emissionsCalculated,
        },
      });

      // Save corresponding CarbonRecord aggregate
      await tx.carbonRecord.create({
        data: {
          userId,
          category,
          emissions: emissionsCalculated,
        },
      });

      // Give green points for logging
      const leaderboard = await tx.leaderboard.findUnique({
        where: { userId },
      });
      if (leaderboard) {
        await tx.leaderboard.update({
          where: { userId },
          data: {
            totalPoints: leaderboard.totalPoints + 15, // +15 Green points for daily log
          },
        });
      }

      return {
        log,
        pointsAwarded: 15,
      };
    });
  }

  async getHistory(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 20,
    });
  }

  async getSummary(userId: string) {
    const annualFootprint = await this.calculateAnnualFootprint(userId);
    const monthlyEmissions = Math.round((annualFootprint * 1000) / 12);

    // Sum recent logged emissions
    const recentEmissions = await this.prisma.carbonRecord.groupBy({
      by: ['category'],
      where: { userId },
      _sum: {
        emissions: true,
      },
    });

    const breakdown = recentEmissions.map((item) => ({
      category: item.category,
      totalEmissions: item._sum.emissions || 0,
    }));

    return {
      annualFootprintTons: annualFootprint,
      monthlyEmissionsKg: monthlyEmissions,
      categoryBreakdown: breakdown,
      reductionGoalPercentage: 72, // Completed baseline
    };
  }

  private mapActivityToCategory(activityType: string): ActivityCategory {
    switch (activityType) {
      case 'car_trip':
      case 'transit_ride':
      case 'flight':
        return ActivityCategory.TRANSPORTATION;
      case 'electricity_usage':
      case 'ac_run':
      case 'heating_run':
        return ActivityCategory.ENERGY;
      case 'meat_meal':
      case 'dairy_meal':
        return ActivityCategory.FOOD;
      case 'shopping_delivery':
      case 'purchase_goods':
        return ActivityCategory.SHOPPING;
      default:
        return ActivityCategory.WASTE;
    }
  }
}
