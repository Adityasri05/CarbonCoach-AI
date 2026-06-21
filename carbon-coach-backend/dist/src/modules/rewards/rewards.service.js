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
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RewardsService = class RewardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRewards() {
        return this.prisma.reward.findMany({
            where: { active: true },
        });
    }
    async redeemReward(userId, rewardId) {
        const reward = await this.prisma.reward.findUnique({
            where: { id: rewardId },
        });
        if (!reward) {
            throw new common_1.NotFoundException("Reward not found");
        }
        const leaderboard = await this.prisma.leaderboard.findUnique({
            where: { userId },
        });
        if (!leaderboard || leaderboard.totalPoints < reward.pointsRequired) {
            throw new common_1.BadRequestException("Insufficient Green Points balance");
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.leaderboard.update({
                where: { userId },
                data: {
                    totalPoints: leaderboard.totalPoints - reward.pointsRequired,
                },
            });
            const transaction = await tx.rewardTransaction.create({
                data: {
                    userId,
                    rewardId,
                    pointsSpent: reward.pointsRequired,
                },
            });
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
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map