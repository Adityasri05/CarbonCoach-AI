import { Test, TestingModule } from "@nestjs/testing";
import { CameraService } from "./camera.service";
import { PrismaService } from "../../prisma/prisma.service";

// Mock @google/genai SDK
const mockGenerateContent = jest.fn().mockResolvedValue({
  text: JSON.stringify({
    detectedItem: "Mocked Item",
    emission: 1.5,
    alternative: "Mocked Green Alternative",
    alternativeEmission: 0.3,
  }),
});

jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: (...args: any[]) => mockGenerateContent(...args),
        },
      };
    }),
  };
});

describe("CameraService", () => {
  let service: CameraService;
  let prisma: PrismaService;

  const mockPrismaService = {
    visionAnalysis: {
      create: jest.fn((args) => Promise.resolve({ id: "scan-123", ...args.data })),
      findMany: jest.fn(),
    },
    leaderboard: {
      findUnique: jest.fn().mockResolvedValue({ totalPoints: 100 }),
      update: jest.fn().mockResolvedValue(null),
    },
    notification: {
      create: jest.fn().mockResolvedValue(null),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    // Mock global fetch for Google Vision REST API call
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        responses: [
          {
            labelAnnotations: [
              { description: "Washing machine" },
            ],
          },
        ],
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CameraService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CameraService>(CameraService);
    prisma = module.get<PrismaService>(PrismaService);
    mockGenerateContent.mockClear();
    jest.clearAllMocks();
  });

  it("should process Vision scan and return dynamic mapping via Gemini", async () => {
    process.env.VISION_API_KEY = "test-api-key";

    const result = await service.analyzeImage("user-123", "appliance", "data:image/png;base64,mockedbase64");
    
    expect(result.scan).toBeDefined();
    expect(result.scan.detectedItem).toBe("Mocked Item");
    expect(result.scan.saving).toBe(1.2); // 1.5 - 0.3
    expect(global.fetch).toHaveBeenCalled();
  });

  describe("API fallbacks", () => {
    beforeEach(() => {
      delete process.env.VISION_API_KEY;
    });

    it("should fallback to meal preset when dynamic analysis is unavailable", async () => {
      const result = await service.analyzeImage("user-123", "meal", "http://example.com/img.jpg");
      expect(result.scan.detectedItem).toBe("Beef Burger & Fries");
      expect(result.scan.emission).toBe(5.4);
      expect(result.scan.alternativeEmission).toBe(1.2);
    });

    it("should fallback to vehicle preset when dynamic analysis is unavailable", async () => {
      const result = await service.analyzeImage("user-123", "vehicle", "http://example.com/img.jpg");
      expect(result.scan.detectedItem).toBe("Mid-size Gasoline SUV");
      expect(result.scan.emission).toBe(14.5);
      expect(result.scan.alternativeEmission).toBe(2.8);
    });

    it("should fallback to appliance preset when dynamic analysis is unavailable", async () => {
      const result = await service.analyzeImage("user-123", "appliance", "http://example.com/img.jpg");
      expect(result.scan.detectedItem).toBe("Standard Electric Clothes Dryer");
      expect(result.scan.emission).toBe(3.2);
      expect(result.scan.alternativeEmission).toBe(0.8);
    });
  });

  describe("getRecentScans", () => {
    it("should return list of user scan analyses", async () => {
      const mockScans = [{ id: "scan-1" }, { id: "scan-2" }];
      jest.spyOn(prisma.visionAnalysis, "findMany").mockResolvedValue(mockScans as any);

      const result = await service.getRecentScans("user-123");
      expect(result).toEqual(mockScans);
      expect(prisma.visionAnalysis.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    });
  });
});
