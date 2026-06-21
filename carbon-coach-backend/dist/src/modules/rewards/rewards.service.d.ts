import { PrismaService } from "../../prisma/prisma.service";
export declare class RewardsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    redeemReward(userId: string, rewardId: string): Promise<{
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
