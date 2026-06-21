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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                leaderboard: true,
                habits: true,
            },
        });
        const currentScore = 6.2;
        const monthlyEmissions = Math.round((currentScore * 1000) / 12);
        const breakdownData = [
            { name: "Transportation", value: Math.round(currentScore * 0.42 * 10) / 10, color: "#10B981" },
            { name: "Energy", value: Math.round(currentScore * 0.28 * 10) / 10, color: "#14B8A6" },
            { name: "Food", value: Math.round(currentScore * 0.15 * 10) / 10, color: "#0EA5E9" },
            { name: "Shopping", value: Math.round(currentScore * 0.10 * 10) / 10, color: "#F59E0B" },
            { name: "Waste", value: Math.round(currentScore * 0.05 * 10) / 10, color: "#EF4444" },
        ];
        return {
            carbonScoreTons: currentScore,
            monthlyEmissionsKg: monthlyEmissions,
            reductionGoalPercentage: 72,
            greenPoints: user?.leaderboard?.totalPoints || 0,
            breakdown: breakdownData,
        };
    }
    async getTrends(userId, timeframe) {
        if (timeframe === "daily") {
            return [
                { name: "Mon", Emissions: 18 },
                { name: "Tue", Emissions: 15 },
                { name: "Wed", Emissions: 19 },
                { name: "Thu", Emissions: 14 },
                { name: "Fri", Emissions: 21 },
                { name: "Sat", Emissions: 12 },
                { name: "Sun", Emissions: 10 },
            ];
        }
        if (timeframe === "weekly") {
            return [
                { name: "Wk 1", Emissions: 135 },
                { name: "Wk 2", Emissions: 130 },
                { name: "Wk 3", Emissions: 125 },
                { name: "Wk 4", Emissions: 120 },
                { name: "Wk 5", Emissions: 110 },
            ];
        }
        return [
            { name: "Jan", Emissions: 580 },
            { name: "Feb", Emissions: 560 },
            { name: "Mar", Emissions: 550 },
            { name: "Apr", Emissions: 535 },
            { name: "May", Emissions: 530 },
            { name: "Jun", Emissions: 520 },
        ];
    }
    async getProjections(userId) {
        const baseline = 6.2;
        const projectedTarget = 4.8;
        return {
            currentTons: baseline,
            targetTons: projectedTarget,
            reductionPct: Math.round(((baseline - projectedTarget) / baseline) * 100),
            timeline: [
                { year: "2026", Current: baseline, Target: baseline },
                { year: "2027", Current: 5.8, Target: 5.2 },
                { year: "2028", Current: 5.4, Target: 4.8 },
            ],
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map