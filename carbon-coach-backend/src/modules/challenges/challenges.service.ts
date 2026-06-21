import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ChallengeStatus } from "@prisma/client";

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async getChallenges(userId: string) {
    const list = await this.prisma.challenge.findMany({
      where: { active: true },
    });

    const participations = await this.prisma.challengeParticipation.findMany({
      where: { userId },
    });

    return list.map((item) => {
      const part = participations.find((p) => p.challengeId === item.id);
      return {
        ...item,
        status: part ? part.status : "NOT_JOINED",
        daysCompleted: part ? part.daysCompleted : 0,
        progress: part ? part.progress : 0,
      };
    });
  }

  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }

    const existing = await this.prisma.challengeParticipation.findUnique({
      where: {
        userId_challengeId: { userId, challengeId },
      },
    });

    if (existing) {
      throw new BadRequestException("Already joined this challenge");
    }

    return this.prisma.challengeParticipation.create({
      data: {
        userId,
        challengeId,
        status: ChallengeStatus.JOINED,
        progress: 0,
        daysCompleted: 0,
      },
    });
  }

  async logProgress(userId: string, challengeId: string, daysToAdd: number) {
    const part = await this.prisma.challengeParticipation.findUnique({
      where: {
        userId_challengeId: { userId, challengeId },
      },
      include: { challenge: true },
    });

    if (!part) {
      throw new NotFoundException("User has not joined this challenge");
    }

    if (part.status === ChallengeStatus.COMPLETED) {
      throw new BadRequestException("Challenge is already completed");
    }

    const completed = Math.min(part.challenge.daysTotal, part.daysCompleted + daysToAdd);
    const pct = Math.round((completed / part.challenge.daysTotal) * 100);
    const isFinished = completed === part.challenge.daysTotal;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.challengeParticipation.update({
        where: { id: part.id },
        data: {
          daysCompleted: completed,
          progress: pct,
          status: isFinished ? ChallengeStatus.COMPLETED : ChallengeStatus.JOINED,
          completedAt: isFinished ? new Date() : null,
        },
      });

      if (isFinished) {
        // Award points on completion
        const leaderboard = await tx.leaderboard.findUnique({ where: { userId } });
        if (leaderboard) {
          await tx.leaderboard.update({
            where: { userId },
            data: {
              totalPoints: leaderboard.totalPoints + part.challenge.points,
            },
          });
        }

        // Add achievement notification
        await tx.notification.create({
          data: {
            userId,
            type: "achievement",
            message: `🏆 Completed challenge: "${part.challenge.title}"! +${part.challenge.points} Green Points!`,
          },
        });

        // Add user achievement badge
        await tx.achievement.create({
          data: {
            userId,
            badgeName: part.challenge.title,
            badgeIcon: "🏆",
            badgeDesc: `Completed: ${part.challenge.description}`,
          },
        });
      }

      return updated;
    });
  }
}
