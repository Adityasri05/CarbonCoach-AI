import { PrismaService } from '../../prisma/prisma.service';
export declare class TwinService {
    private prisma;
    constructor(prisma: PrismaService);
    simulate(userId: string, scenarioName: string, transportSlider: number, energySlider: number, foodSlider: string, flightsSlider: number): Promise<{
        simulation: {
            id: string;
            createdAt: Date;
            userId: string;
            scenarioName: string;
            transportSlider: number;
            energySlider: number;
            foodSlider: string;
            flightsSlider: number;
            currentScore: number;
            simulatedScore: number;
        };
        savingPercentage: number;
        co2SavedTons: number;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        scenarioName: string;
        transportSlider: number;
        energySlider: number;
        foodSlider: string;
        flightsSlider: number;
        currentScore: number;
        simulatedScore: number;
    }[]>;
}
