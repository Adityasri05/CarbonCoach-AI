import { RewardsService } from "./rewards.service";
export declare class RewardsController {
    private rewardsService;
    constructor(rewardsService: RewardsService);
    getRewards(): Promise<{
        id: string;
        title: string;
        description: string;
        category: string;
        active: boolean;
        createdAt: Date;
        pointsRequired: number;
        impactGenerated: string;
    }[]>;
    redeem(req: {
        user: {
            id: string;
        };
    }, body: {
        rewardId: string;
    }): Promise<{
        transaction: {
            id: string;
            createdAt: Date;
            userId: string;
            pointsSpent: number;
            redeemedCount: number;
            rewardId: string;
        };
        remainingPoints: number;
    }>;
}
