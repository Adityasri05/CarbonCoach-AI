import { PrismaService } from "../../prisma/prisma.service";
export declare class AIService {
    private prisma;
    private ai;
    constructor(prisma: PrismaService);
    generateRecommendations(userId: string): Promise<({
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
    chatbotResponse(userId: string, userMessage: string): Promise<{
        reply: string;
        timestamp: Date;
    }>;
    getChatHistory(userId: string): Promise<{
        id: string;
        userId: string;
        text: string;
        sender: string;
        timestamp: Date;
    }[]>;
}
