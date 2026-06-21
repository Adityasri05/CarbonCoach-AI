import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        leaderboard: true,
        habits: true,
      },
    });

    const currentScore = 6.2; // Baseline Tons CO2/yr
    const monthlyEmissions = Math.round((currentScore * 1000) / 12); // kg CO2

    const breakdownData = [
      { name: "Transportation", value: Math.round(currentScore * 0.42 * 10) / 10, color: "#10B981" },
      { name: "Energy", value: Math.round(currentScore * 0.28 * 10) / 10, color: "#14B8A6" },
      { name: "Food", value: Math.round(currentScore * 0.15 * 10) / 10, color: "#0EA5E9" },
      { name: "Shopping", value: Math.round(currentScore * 0.10 * 10) / 10, color: "#F59E0B" },
      { name: "Waste", value: Math.round(currentScore * 0.05 * 10) / 10, color: "#EF4444" },
    ];

    return {
      carbonScoreTons: currentScore,
      monthlyEmissionsKg: monthlyEmissions,
      reductionGoalPercentage: 72,
      greenPoints: user?.leaderboard?.totalPoints || 0,
      breakdown: breakdownData,
    };
  }

  async getTrends(userId: string, timeframe: "daily" | "weekly" | "monthly") {
    // Return structured data ready for Recharts line chart mapping
    if (timeframe === "daily") {
      return [
        { name: "Mon", Emissions: 18 },
        { name: "Tue", Emissions: 15 },
        { name: "Wed", Emissions: 19 },
        { name: "Thu", Emissions: 14 },
        { name: "Fri", Emissions: 21 },
        { name: "Sat", Emissions: 12 },
        { name: "Sun", Emissions: 10 },
      ];
    }

    if (timeframe === "weekly") {
      return [
        { name: "Wk 1", Emissions: 135 },
        { name: "Wk 2", Emissions: 130 },
        { name: "Wk 3", Emissions: 125 },
        { name: "Wk 4", Emissions: 120 },
        { name: "Wk 5", Emissions: 110 },
      ];
    }

    return [
      { name: "Jan", Emissions: 580 },
      { name: "Feb", Emissions: 560 },
      { name: "Mar", Emissions: 550 },
      { name: "Apr", Emissions: 535 },
      { name: "May", Emissions: 530 },
      { name: "Jun", Emissions: 520 },
    ];
  }

  async getProjections(userId: string) {
    const baseline = 6.2;
    const projectedTarget = 4.8;
    return {
      currentTons: baseline,
      targetTons: projectedTarget,
      reductionPct: Math.round(((baseline - projectedTarget) / baseline) * 100),
      timeline: [
        { year: "2026", Current: baseline, Target: baseline },
        { year: "2027", Current: 5.8, Target: 5.2 },
        { year: "2028", Current: 5.4, Target: 4.8 },
      ],
    };
  }
}
