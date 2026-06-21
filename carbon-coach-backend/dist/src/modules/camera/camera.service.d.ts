import { PrismaService } from '../../prisma/prisma.service';
export declare class CameraService {
    private prisma;
    private ai;
    constructor(prisma: PrismaService);
    analyzeImage(userId: string, category: string, imageUrl: string): Promise<{
        scan: {
            id: string;
            category: string;
            createdAt: Date;
            userId: string;
            detectedItem: string;
            emission: number;
            alternative: string;
            alternativeEmission: number;
            imageUrl: string;
            saving: number;
        };
        savingPercentage: number;
        pointsAwarded: number;
    }>;
    getRecentScans(userId: string): Promise<{
        id: string;
        category: string;
        createdAt: Date;
        userId: string;
        detectedItem: string;
        emission: number;
        alternative: string;
        alternativeEmission: number;
        imageUrl: string;
        saving: number;
    }[]>;
}
