"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ChallengesService = class ChallengesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChallenges(userId) {
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
                status: part ? part.status : 'NOT_JOINED',
                daysCompleted: part ? part.daysCompleted : 0,
                progress: part ? part.progress : 0,
            };
        });
    }
    async joinChallenge(userId, challengeId) {
        const challenge = await this.prisma.challenge.findUnique({
            where: { id: challengeId },
        });
        if (!challenge) {
            throw new common_1.NotFoundException('Challenge not found');
        }
        const existing = await this.prisma.challengeParticipation.findUnique({
            where: {
                userId_challengeId: { userId, challengeId },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already joined this challenge');
        }
        return this.prisma.challengeParticipation.create({
            data: {
                userId,
                challengeId,
                status: client_1.ChallengeStatus.JOINED,
                progress: 0,
                daysCompleted: 0,
            },
        });
    }
    async logProgress(userId, challengeId, daysToAdd) {
        const part = await this.prisma.challengeParticipation.findUnique({
            where: {
                userId_challengeId: { userId, challengeId },
            },
            include: { challenge: true },
        });
        if (!part) {
            throw new common_1.NotFoundException('User has not joined this challenge');
        }
        if (part.status === client_1.ChallengeStatus.COMPLETED) {
            throw new common_1.BadRequestException('Challenge is already completed');
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
                    status: isFinished
                        ? client_1.ChallengeStatus.COMPLETED
                        : client_1.ChallengeStatus.JOINED,
                    completedAt: isFinished ? new Date() : null,
                },
            });
            if (isFinished) {
                const leaderboard = await tx.leaderboard.findUnique({
                    where: { userId },
                });
                if (leaderboard) {
                    await tx.leaderboard.update({
                        where: { userId },
                        data: {
                            totalPoints: leaderboard.totalPoints + part.challenge.points,
                        },
                    });
                }
                await tx.notification.create({
                    data: {
                        userId,
                        type: 'achievement',
                        message: `🏆 Completed challenge: "${part.challenge.title}"! +${part.challenge.points} Green Points!`,
                    },
                });
                await tx.achievement.create({
                    data: {
                        userId,
                        badgeName: part.challenge.title,
                        badgeIcon: '🏆',
                        badgeDesc: `Completed: ${part.challenge.description}`,
                    },
                });
            }
            return updated;
        });
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map