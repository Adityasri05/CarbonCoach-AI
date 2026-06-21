import { ChallengesService } from './challenges.service';
export declare class ChallengesController {
    private challengesService;
    constructor(challengesService: ChallengesService);
    getChallenges(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    joinChallenge(req: {
        user: {
            id: string;
        };
    }, body: {
        challengeId: string;
    }): Promise<{
        id: string;
        userId: string;
        challengeId: string;
        progress: number;
        daysCompleted: number;
        status: import("@prisma/client").$Enums.ChallengeStatus;
        joinedAt: Date;
        completedAt: Date | null;
    }>;
    logProgress(req: {
        user: {
            id: string;
        };
    }, body: {
        challengeId: string;
        daysCompleted: number;
    }): Promise<{
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
