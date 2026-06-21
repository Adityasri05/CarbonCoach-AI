import { AIService } from './ai.service';
export declare class AIController {
    private aiService;
    constructor(aiService: AIService);
    getRecommendations(req: {
        user: {
            id: string;
        };
    }): Promise<({
        category: "TRANSPORTATION";
        text: string;
        co2SavingEstimate: number;
    } | {
        category: "ENERGY";
        text: string;
        co2SavingEstimate: number;
    } | {
        category: "FOOD";
        text: string;
        co2SavingEstimate: number;
    } | {
        category: "WASTE";
        text: string;
        co2SavingEstimate: number;
    })[]>;
    chat(req: {
        user: {
            id: string;
        };
    }, body: {
        message: string;
    }): Promise<{
        reply: string;
        timestamp: Date;
    }>;
    getChatHistory(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        userId: string;
        text: string;
        sender: string;
        timestamp: Date;
    }[]>;
}
