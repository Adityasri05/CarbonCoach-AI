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
exports.CarbonService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CarbonService = class CarbonService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    TRANSPORT_FACTORS = {
        Gasoline: 0.18,
        Diesel: 0.2,
        Hybrid: 0.09,
        Electric: 0.04,
        None: 0.02,
    };
    FOOD_ANNUAL_TONS = {
        Vegan: 0.6,
        Vegetarian: 0.9,
        Eggetarian: 1.1,
        'Non-Vegetarian': 2.1,
    };
    SHOPPING_ANNUAL_TONS = {
        Daily: 1.2,
        Weekly: 0.8,
        Monthly: 0.4,
        Rarely: 0.1,
    };
    WASTE_ANNUAL_TONS = {
        Never: 0.8,
        Sometimes: 0.5,
        Always: 0.3,
    };
    async calculateAnnualFootprint(userId) {
        const habits = await this.prisma.habits.findUnique({
            where: { userId },
        });
        if (!habits)
            return 6.2;
        const factorKey = habits.vehicleType || 'Gasoline';
        const transportFactor = this.TRANSPORT_FACTORS[factorKey] || 0.18;
        const transportTons = (habits.travelDistance * 365 * transportFactor) / 1000;
        const electricityTons = (habits.electricityBill * 12 * 7 * 0.4) / 1000;
        const acTons = (habits.acUsage * 365 * 0.5) / 1000;
        const energyTons = electricityTons + acTons;
        const foodKey = habits.foodHabit ||
            'Non-Vegetarian';
        const foodTons = this.FOOD_ANNUAL_TONS[foodKey] || 2.1;
        const shoppingKey = habits.shoppingFrequency ||
            'Monthly';
        const shoppingTons = this.SHOPPING_ANNUAL_TONS[shoppingKey] || 0.4;
        const wasteKey = habits.recyclingHabits ||
            'Sometimes';
        const wasteTons = this.WASTE_ANNUAL_TONS[wasteKey] || 0.5;
        const total = parseFloat((transportTons +
            energyTons +
            foodTons +
            shoppingTons +
            wasteTons).toFixed(1));
        return total;
    }
    async logActivity(userId, activityType, quantity, unit) {
        let emissionsCalculated = 0;
        if (activityType === 'car_trip') {
            emissionsCalculated = quantity * 0.18;
        }
        else if (activityType === 'electricity_usage') {
            emissionsCalculated = quantity * 0.4;
        }
        else if (activityType === 'meat_meal') {
            emissionsCalculated = quantity * 2.5;
        }
        else {
            emissionsCalculated = quantity * 0.1;
        }
        emissionsCalculated = parseFloat(emissionsCalculated.toFixed(2));
        const category = this.mapActivityToCategory(activityType);
        return this.prisma.$transaction(async (tx) => {
            const log = await tx.activityLog.create({
                data: {
                    userId,
                    activityType,
                    quantity,
                    unit,
                    emissionsCalculated,
                },
            });
            await tx.carbonRecord.create({
                data: {
                    userId,
                    category,
                    emissions: emissionsCalculated,
                },
            });
            const leaderboard = await tx.leaderboard.findUnique({
                where: { userId },
            });
            if (leaderboard) {
                await tx.leaderboard.update({
                    where: { userId },
                    data: {
                        totalPoints: leaderboard.totalPoints + 15,
                    },
                });
            }
            return {
                log,
                pointsAwarded: 15,
            };
        });
    }
    async getHistory(userId) {
        return this.prisma.activityLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 20,
        });
    }
    async getSummary(userId) {
        const annualFootprint = await this.calculateAnnualFootprint(userId);
        const monthlyEmissions = Math.round((annualFootprint * 1000) / 12);
        const recentEmissions = await this.prisma.carbonRecord.groupBy({
            by: ['category'],
            where: { userId },
            _sum: {
                emissions: true,
            },
        });
        const breakdown = recentEmissions.map((item) => ({
            category: item.category,
            totalEmissions: item._sum.emissions || 0,
        }));
        return {
            annualFootprintTons: annualFootprint,
            monthlyEmissionsKg: monthlyEmissions,
            categoryBreakdown: breakdown,
            reductionGoalPercentage: 72,
        };
    }
    mapActivityToCategory(activityType) {
        switch (activityType) {
            case 'car_trip':
            case 'transit_ride':
            case 'flight':
                return client_1.ActivityCategory.TRANSPORTATION;
            case 'electricity_usage':
            case 'ac_run':
            case 'heating_run':
                return client_1.ActivityCategory.ENERGY;
            case 'meat_meal':
            case 'dairy_meal':
                return client_1.ActivityCategory.FOOD;
            case 'shopping_delivery':
            case 'purchase_goods':
                return client_1.ActivityCategory.SHOPPING;
            default:
                return client_1.ActivityCategory.WASTE;
        }
    }
};
exports.CarbonService = CarbonService;
exports.CarbonService = CarbonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarbonService);
//# sourceMappingURL=carbon.service.js.map