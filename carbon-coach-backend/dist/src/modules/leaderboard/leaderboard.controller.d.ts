import { LeaderboardService } from "./leaderboard.service";
export declare class LeaderboardController {
    private leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(): Promise<{
        rank: number;
        userId: string;
        name: string;
        avatarUrl: string | null | undefined;
        reductionPercentage: number;
        totalPoints: number;
    }[]>;
}
