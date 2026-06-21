import { CameraService } from './camera.service';
export declare class CameraController {
    private cameraService;
    constructor(cameraService: CameraService);
    analyze(req: {
        user: {
            id: string;
        };
    }, body: {
        category: string;
        imageUrl: string;
    }): Promise<{
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
    getHistory(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
