import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class CameraService {
  private ai: GoogleGenAI;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeImage(userId: string, category: string, imageUrl: string) {
    let detectedItem = "Unknown Object";
    let emission = 2.0;
    let alternative = "Green alternative";
    let alternativeEmission = 0.5;
    let successfullyAnalyzed = false;

    // 1. Attempt to call Google Cloud Vision API if VISION_API_KEY is configured
    if (process.env.VISION_API_KEY) {
      try {
        let imagePayload: any = {};
        if (imageUrl.startsWith("data:")) {
          const commaIndex = imageUrl.indexOf(",");
          if (commaIndex !== -1) {
            const base64Data = imageUrl.substring(commaIndex + 1);
            imagePayload = { content: base64Data };
          } else {
            imagePayload = { source: { imageUri: imageUrl } };
          }
        } else {
          imagePayload = { source: { imageUri: imageUrl } };
        }

        const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`;
        const visionResponse = await fetch(visionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: imagePayload,
                features: [{ type: "LABEL_DETECTION", maxResults: 15 }],
              },
            ],
          }),
        });

        if (!visionResponse.ok) {
          throw new Error(`Vision API response failed: ${visionResponse.statusText}`);
        }

        const visionData = await visionResponse.json();
        const labels: string[] = visionData.responses?.[0]?.labelAnnotations?.map((l: any) => l.description) || [];

        if (labels.length > 0) {
          // 2. Map detected labels to Carbon emissions & green alternatives using Gemini Structured Outputs
          const prompt = `The user scanned an image under the category "${category}".
Google Cloud Vision detected these labels from the image: ${labels.join(", ")}.

Analyze this item and estimate its carbon footprint and suggest a sustainable greener alternative.`;

          const response = await this.ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  detectedItem: { type: "STRING" },
                  emission: { type: "NUMBER" },
                  alternative: { type: "STRING" },
                  alternativeEmission: { type: "NUMBER" }
                },
                required: ["detectedItem", "emission", "alternative", "alternativeEmission"]
              }
            }
          });

          const parsed = JSON.parse(response.text || "{}");
          if (parsed.detectedItem && typeof parsed.emission === "number") {
            detectedItem = parsed.detectedItem;
            emission = parsed.emission;
            alternative = parsed.alternative || "Green alternative";
            alternativeEmission = typeof parsed.alternativeEmission === "number" ? parsed.alternativeEmission : 0.5;
            successfullyAnalyzed = true;
          }
        }
      } catch (error) {
        console.error("Failed to dynamically analyze image with APIs, using fallback presets:", error);
      }
    }

    // 3. Fallback presets if APIs failed or key wasn't present
    if (!successfullyAnalyzed) {
      if (category === "meal") {
        detectedItem = "Beef Burger & Fries";
        emission = 5.4;
        alternative = "Beyond Plant Burger";
        alternativeEmission = 1.2;
      } else if (category === "vehicle") {
        detectedItem = "Mid-size Gasoline SUV";
        emission = 14.5;
        alternative = "Electric Hatchback / e-Bike";
        alternativeEmission = 2.8;
      } else if (category === "appliance") {
        detectedItem = "Standard Electric Clothes Dryer";
        emission = 3.2;
        alternative = "Air Drying / Energy Star Dryer";
        alternativeEmission = 0.8;
      }
    }

    const saving = parseFloat((emission - alternativeEmission).toFixed(2));
    const savingPct = Math.round((saving / emission) * 100);

    return this.prisma.$transaction(async (tx) => {
      // Create scan transaction record
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

      // Update Leaderboard points balance
      const leaderboard = await tx.leaderboard.findUnique({ where: { userId } });
      if (leaderboard) {
        await tx.leaderboard.update({
          where: { userId },
          data: {
            totalPoints: leaderboard.totalPoints + 20, // +20 Green Points for scanning
          },
        });
      }

      // Add XP Achievement notification
      await tx.notification.create({
        data: {
          userId,
          type: "success",
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

  async getRecentScans(userId: string) {
    return this.prisma.visionAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }
}
