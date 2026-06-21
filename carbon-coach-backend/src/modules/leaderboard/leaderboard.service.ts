import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    const list = await this.prisma.leaderboard.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        { reductionPercentage: "desc" },
        { totalPoints: "desc" },
      ],
      take: 50,
    });

    return list.map((item, idx) => ({
      rank: idx + 1,
      userId: item.userId,
      name: item.user.profile?.name || "Eco Participant",
      avatarUrl: item.user.profile?.avatarUrl,
      reductionPercentage: item.reductionPercentage,
      totalPoints: item.totalPoints,
    }));
  }
}
