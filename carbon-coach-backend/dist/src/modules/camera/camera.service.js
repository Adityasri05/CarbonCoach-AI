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
exports.CameraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const genai_1 = require("@google/genai");
let CameraService = class CameraService {
    prisma;
    ai;
    constructor(prisma) {
        this.prisma = prisma;
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    async analyzeImage(userId, category, imageUrl) {
        let detectedItem = 'Unknown Object';
        let emission = 2.0;
        let alternative = 'Green alternative';
        let alternativeEmission = 0.5;
        let successfullyAnalyzed = false;
        if (process.env.VISION_API_KEY) {
            try {
                let imagePayload = {};
                if (imageUrl.startsWith('data:')) {
                    const commaIndex = imageUrl.indexOf(',');
                    if (commaIndex !== -1) {
                        const base64Data = imageUrl.substring(commaIndex + 1);
                        imagePayload = { content: base64Data };
                    }
                    else {
                        imagePayload = { source: { imageUri: imageUrl } };
                    }
                }
                else {
                    imagePayload = { source: { imageUri: imageUrl } };
                }
                const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`;
                const visionResponse = await fetch(visionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [
                            {
                                image: imagePayload,
                                features: [{ type: 'LABEL_DETECTION', maxResults: 15 }],
                            },
                        ],
                    }),
                });
                if (!visionResponse.ok) {
                    throw new Error(`Vision API response failed: ${visionResponse.statusText}`);
                }
                const visionData = (await visionResponse.json());
                const labels = visionData.responses?.[0]?.labelAnnotations
                    ?.map((l) => l.description || '')
                    .filter(Boolean) || [];
                if (labels.length > 0) {
                    const prompt = `The user scanned an image under the category "${category}".
Google Cloud Vision detected these labels from the image: ${labels.join(', ')}.

Analyze this item and estimate its carbon footprint and suggest a sustainable greener alternative.`;
                    const response = await this.ai.models.generateContent({
                        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
                        contents: prompt,
                        config: {
                            responseMimeType: 'application/json',
                            responseSchema: {
                                type: 'OBJECT',
                                properties: {
                                    detectedItem: { type: 'STRING' },
                                    emission: { type: 'NUMBER' },
                                    alternative: { type: 'STRING' },
                                    alternativeEmission: { type: 'NUMBER' },
                                },
                                required: [
                                    'detectedItem',
                                    'emission',
                                    'alternative',
                                    'alternativeEmission',
                                ],
                            },
                        },
                    });
                    const parsed = JSON.parse(response.text || '{}');
                    if (parsed.detectedItem && typeof parsed.emission === 'number') {
                        detectedItem = parsed.detectedItem;
                        emission = parsed.emission;
                        alternative = parsed.alternative || 'Green alternative';
                        alternativeEmission =
                            typeof parsed.alternativeEmission === 'number'
                                ? parsed.alternativeEmission
                                : 0.5;
                        successfullyAnalyzed = true;
                    }
                }
            }
            catch (error) {
                console.error('Failed to dynamically analyze image with APIs, using fallback presets:', error);
            }
        }
        if (!successfullyAnalyzed) {
            if (category === 'meal') {
                detectedItem = 'Beef Burger & Fries';
                emission = 5.4;
                alternative = 'Beyond Plant Burger';
                alternativeEmission = 1.2;
            }
            else if (category === 'vehicle') {
                detectedItem = 'Mid-size Gasoline SUV';
                emission = 14.5;
                alternative = 'Electric Hatchback / e-Bike';
                alternativeEmission = 2.8;
            }
            else if (category === 'appliance') {
                detectedItem = 'Standard Electric Clothes Dryer';
                emission = 3.2;
                alternative = 'Air Drying / Energy Star Dryer';
                alternativeEmission = 0.8;
            }
        }
        const saving = parseFloat((emission - alternativeEmission).toFixed(2));
        const savingPct = Math.round((saving / emission) * 100);
        return this.prisma.$transaction(async (tx) => {
            const scan = await tx.visionAnalysis.create({
                data: {
                    userId,
                    imageUrl,
                    detectedItem,
                    emission,
                    alternative,
                    alternativeEmission,
                    saving,
                    category,
                },
            });
            const leaderboard = await tx.leaderboard.findUnique({
                where: { userId },
            });
            if (leaderboard) {
                await tx.leaderboard.update({
                    where: { userId },
                    data: {
                        totalPoints: leaderboard.totalPoints + 20,
                    },
                });
            }
            await tx.notification.create({
                data: {
                    userId,
                    type: 'success',
                    message: `📸 Detected: ${detectedItem}! Earned +20 pts, +50 XP!`,
                },
            });
            return {
                scan,
                savingPercentage: savingPct,
                pointsAwarded: 20,
            };
        });
    }
    async getRecentScans(userId) {
        return this.prisma.visionAnalysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
};
exports.CameraService = CameraService;
exports.CameraService = CameraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CameraService);
//# sourceMappingURL=camera.service.js.map