import { PrismaService } from "../../prisma/prisma.service";
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(): Promise<{
        rank: number;
        userId: string;
        name: string;
        avatarUrl: string | null | undefined;
        reductionPercentage: number;
        totalPoints: number;
    }[]>;
}
