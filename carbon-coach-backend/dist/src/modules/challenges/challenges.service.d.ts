import { PrismaService } from "../../prisma/prisma.service";
export declare class ChallengesService {
    private prisma;
    constructor(prisma: PrismaService);
    getChallenges(userId: string): Promise<{
        status: string;
        daysCompleted: number;
        progress: number;
        id: string;
        title: string;
        description: string;
        points: number;
        daysTotal: number;
        category: string;
        active: boolean;
        createdAt: Date;
    }[]>;
    joinChallenge(userId: string, challengeId: string): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        daysCompleted: number;
        status: import("@prisma/client").$Enums.ChallengeStatus;
        joinedAt: Date;
        completedAt: Date | null;
    }>;
    logProgress(userId: string, challengeId: string, daysToAdd: number): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        daysCompleted: number;
        status: import("@prisma/client").$Enums.ChallengeStatus;
        joinedAt: Date;
        completedAt: Date | null;
    }>;
}
