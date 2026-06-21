import { CarbonService } from './carbon.service';
export declare class CarbonController {
    private carbonService;
    constructor(carbonService: CarbonService);
    logActivity(req: {
        user: {
            id: string;
        };
    }, body: {
        activityType: string;
        quantity: number;
        unit: string;
    }): Promise<{
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
    getHistory(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        activityType: string;
        quantity: number;
        unit: string;
        emissionsCalculated: number;
        date: Date;
    }[]>;
    getSummary(req: {
        user: {
            id: string;
        };
    }): Promise<{
        annualFootprintTons: number;
        monthlyEmissionsKg: number;
        categoryBreakdown: {
            category: import("@prisma/client").$Enums.ActivityCategory;
            totalEmissions: number;
        }[];
        reductionGoalPercentage: number;
    }>;
}
