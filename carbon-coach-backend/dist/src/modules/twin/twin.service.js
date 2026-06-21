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
exports.TwinService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TwinService = class TwinService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async simulate(userId, scenarioName, transportSlider, energySlider, foodSlider, flightsSlider) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { habits: true },
        });
        const currentScore = user ? 6.2 : 6.2;
        const simulatedTransport = ((7 - transportSlider) * 52 * 8) / 1000;
        const simulatedEnergy = (energySlider * 12 * 7 * 0.4) / 1000 + (365 * 0.5 * 2) / 1000;
        let simulatedFood = 2.1;
        if (foodSlider === 'Vegan')
            simulatedFood = 0.6;
        else if (foodSlider === 'Vegetarian')
            simulatedFood = 0.9;
        else if (foodSlider === 'Eggetarian')
            simulatedFood = 1.1;
        const simulatedFlights = flightsSlider * 0.9;
        const wasteShoppingBaseline = 1.1;
        const simulatedScore = parseFloat((simulatedTransport +
            simulatedEnergy +
            simulatedFood +
            simulatedFlights +
            wasteShoppingBaseline).toFixed(1));
        const savingPercentage = Math.max(0, Math.round(((currentScore - simulatedScore) / currentScore) * 100));
        const simulation = await this.prisma.carbonTwinSimulation.create({
            data: {
                userId,
                scenarioName,
                transportSlider,
                energySlider,
                foodSlider,
                flightsSlider,
                currentScore,
                simulatedScore,
            },
        });
        return {
            simulation,
            savingPercentage,
            co2SavedTons: parseFloat((currentScore - simulatedScore).toFixed(2)),
        };
    }
    async getHistory(userId) {
        return this.prisma.carbonTwinSimulation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
};
exports.TwinService = TwinService;
exports.TwinService = TwinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TwinService);
//# sourceMappingURL=twin.service.js.map