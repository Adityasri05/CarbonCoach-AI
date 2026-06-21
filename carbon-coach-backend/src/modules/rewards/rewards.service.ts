import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async getRewards() {
    return this.prisma.reward.findMany({
      where: { active: true },
    });
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException("Reward not found");
    }

    const leaderboard = await this.prisma.leaderboard.findUnique({
      where: { userId },
    });

    if (!leaderboard || leaderboard.totalPoints < reward.pointsRequired) {
      throw new BadRequestException("Insufficient Green Points balance");
    }

    return this.prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.leaderboard.update({
        where: { userId },
        data: {
          totalPoints: leaderboard.totalPoints - reward.pointsRequired,
        },
      });

      // Log transaction
      const transaction = await tx.rewardTransaction.create({
        data: {
          userId,
          rewardId,
          pointsSpent: reward.pointsRequired,
        },
      });

      // Add success notification
      await tx.notification.create({
        data: {
          userId,
          type: "success",
          message: `🎁 Redeemed: "${reward.title}"! Deducted ${reward.pointsRequired} pts.`,
        },
      });

      return {
        transaction,
        remainingPoints: leaderboard.totalPoints - reward.pointsRequired,
      };
    });
  }
}
