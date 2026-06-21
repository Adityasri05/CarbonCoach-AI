import { PrismaService } from '../../prisma/prisma.service';
export declare class CarbonService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly TRANSPORT_FACTORS;
    private readonly FOOD_ANNUAL_TONS;
    private readonly SHOPPING_ANNUAL_TONS;
    private readonly WASTE_ANNUAL_TONS;
    calculateAnnualFootprint(userId: string): Promise<number>;
    logActivity(userId: string, activityType: string, quantity: number, unit: string): Promise<{
        log: {
            id: string;
            createdAt: Date;
            userId: string;
            activityType: string;
            quantity: number;
            unit: string;
            emissionsCalculated: number;
            date: Date;
        };
        pointsAwarded: number;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        activityType: string;
        quantity: number;
        unit: string;
        emissionsCalculated: number;
        date: Date;
    }[]>;
    getSummary(userId: string): Promise<{
        annualFootprintTons: number;
        monthlyEmissionsKg: number;
        categoryBreakdown: {
            category: import("@prisma/client").$Enums.ActivityCategory;
            totalEmissions: number;
        }[];
        reductionGoalPercentage: number;
    }>;
    private mapActivityToCategory;
}
