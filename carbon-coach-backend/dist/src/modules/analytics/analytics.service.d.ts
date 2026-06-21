import { PrismaService } from "../../prisma/prisma.service";
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(userId: string): Promise<{
        carbonScoreTons: number;
        monthlyEmissionsKg: number;
        reductionGoalPercentage: number;
        greenPoints: number;
        breakdown: {
            name: string;
            value: number;
            color: string;
        }[];
    }>;
    getTrends(userId: string, timeframe: "daily" | "weekly" | "monthly"): Promise<{
        name: string;
        Emissions: number;
    }[]>;
    getProjections(userId: string): Promise<{
        currentTons: number;
        targetTons: number;
        reductionPct: number;
        timeline: {
            year: string;
            Current: number;
            Target: number;
        }[];
    }>;
}
