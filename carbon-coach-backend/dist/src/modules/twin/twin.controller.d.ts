import { TwinService } from "./twin.service";
export declare class TwinController {
    private twinService;
    constructor(twinService: TwinService);
    simulate(req: {
        user: {
            id: string;
        };
    }, body: {
        scenarioName: string;
        transportSlider: number;
        energySlider: number;
        foodSlider: string;
        flightsSlider: number;
    }): Promise<{
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
    getHistory(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
