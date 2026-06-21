import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    getTrends(req: {
        user: {
            id: string;
        };
    }, timeframe: 'daily' | 'weekly' | 'monthly'): Promise<{
        name: string;
        Emissions: number;
    }[]>;
    getProjections(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
