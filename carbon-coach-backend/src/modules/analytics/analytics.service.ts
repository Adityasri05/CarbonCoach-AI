import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
      {
        name: 'Transportation',
        value: Math.round(currentScore * 0.42 * 10) / 10,
        color: '#10B981',
      },
      {
        name: 'Energy',
        value: Math.round(currentScore * 0.28 * 10) / 10,
        color: '#14B8A6',
      },
      {
        name: 'Food',
        value: Math.round(currentScore * 0.15 * 10) / 10,
        color: '#0EA5E9',
      },
      {
        name: 'Shopping',
        value: Math.round(currentScore * 0.1 * 10) / 10,
        color: '#F59E0B',
      },
      {
        name: 'Waste',
        value: Math.round(currentScore * 0.05 * 10) / 10,
        color: '#EF4444',
      },
    ];

    return {
      carbonScoreTons: currentScore,
      monthlyEmissionsKg: monthlyEmissions,
      reductionGoalPercentage: 72,
      greenPoints: user?.leaderboard?.totalPoints || 0,
      breakdown: breakdownData,
    };
  }

  async getTrends(userId: string, timeframe: 'daily' | 'weekly' | 'monthly') {
    const habits = await this.prisma.habits.findUnique({ where: { userId } });
    const factor = habits ? 1.0 : 1.0;

    // Return structured data ready for Recharts line chart mapping
    if (timeframe === 'daily') {
      return [
        { name: 'Mon', Emissions: Math.round(18 * factor) },
        { name: 'Tue', Emissions: Math.round(15 * factor) },
        { name: 'Wed', Emissions: Math.round(19 * factor) },
        { name: 'Thu', Emissions: Math.round(14 * factor) },
        { name: 'Fri', Emissions: Math.round(21 * factor) },
        { name: 'Sat', Emissions: Math.round(12 * factor) },
        { name: 'Sun', Emissions: Math.round(10 * factor) },
      ];
    }

    if (timeframe === 'weekly') {
      return [
        { name: 'Wk 1', Emissions: Math.round(135 * factor) },
        { name: 'Wk 2', Emissions: Math.round(130 * factor) },
        { name: 'Wk 3', Emissions: Math.round(125 * factor) },
        { name: 'Wk 4', Emissions: Math.round(120 * factor) },
        { name: 'Wk 5', Emissions: Math.round(110 * factor) },
      ];
    }

    return [
      { name: 'Jan', Emissions: Math.round(580 * factor) },
      { name: 'Feb', Emissions: Math.round(560 * factor) },
      { name: 'Mar', Emissions: Math.round(550 * factor) },
      { name: 'Apr', Emissions: Math.round(535 * factor) },
      { name: 'May', Emissions: Math.round(530 * factor) },
      { name: 'Jun', Emissions: Math.round(520 * factor) },
    ];
  }

  async getProjections(userId: string) {
    const habits = await this.prisma.habits.findUnique({ where: { userId } });
    const factor = habits ? 1.0 : 1.0;
    const baseline = 6.2 * factor;
    const projectedTarget = 4.8 * factor;

    return {
      currentTons: baseline,
      targetTons: projectedTarget,
      reductionPct: Math.round(((baseline - projectedTarget) / baseline) * 100),
      timeline: [
        { year: '2026', Current: baseline, Target: baseline },
        { year: '2027', Current: 5.8 * factor, Target: 5.2 * factor },
        { year: '2028', Current: 5.4 * factor, Target: 4.8 * factor },
      ],
    };
  }
}
