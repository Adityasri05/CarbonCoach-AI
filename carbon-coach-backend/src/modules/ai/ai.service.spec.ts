import { Test, TestingModule } from "@nestjs/testing";
import { AIService } from "./ai.service";
import { PrismaService } from "../../prisma/prisma.service";
import { GoogleGenAI } from "@google/genai";

// Mock @google/genai SDK
const mockGenerateContent = jest.fn().mockResolvedValue({
  text: "Mocked Gemini chatbot response",
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

describe("AIService", () => {
  let service: AIService;
  let prisma: PrismaService;

  const mockPrismaService = {
    habits: {
      findUnique: jest.fn(),
    },
    chatHistory: {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    recommendation: {
      create: jest.fn(),
    },
    $transaction: jest.fn((promises) => promises),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    prisma = module.get<PrismaService>(PrismaService);
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({ text: "Mocked Gemini chatbot response" });
    jest.clearAllMocks();
  });

  it("should generate correct recommendations based on user habits", async () => {
    const mockHabits = {
      userId: "user-123",
      vehicleType: "Gasoline",
      travelDistance: 20,
      acUsage: 4,
      foodHabit: "Non-Vegetarian",
      recyclingHabits: "Sometimes",
    };

    jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(mockHabits as any);
    jest.spyOn(prisma.recommendation, "create").mockImplementation((data) => data as any);

    const recs = await service.generateRecommendations("user-123");
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].text).toContain("public transport");
  });

  it("should process user queries and generate bot response", async () => {
    jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(null);
    jest.spyOn(prisma.chatHistory, "create").mockImplementation((data) => data as any);

    const result = await service.chatbotResponse("user-123", "How can I reduce emissions?");
    expect(result.reply).toBeDefined();
    expect(prisma.chatHistory.create).toHaveBeenCalledTimes(2);
  });

  describe("chatbot fallback", () => {
    beforeEach(() => {
      mockGenerateContent.mockRejectedValue(new Error("Gemini API is down"));
    });

    it("should fallback to reduce emissions tips on error", async () => {
      jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.chatHistory, "create").mockImplementation((data) => data as any);

      const result = await service.chatbotResponse("user-123", "how can i reduce emissions?");
      expect(result.reply).toContain("To lower your carbon footprint");
      expect(prisma.chatHistory.create).toHaveBeenCalledTimes(2);
    });

    it("should fallback to cycling tips on error", async () => {
      jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.chatHistory, "create").mockImplementation((data) => data as any);

      const result = await service.chatbotResponse("user-123", "should I use a bike?");
      expect(result.reply).toContain("Cycling generates 0g");
    });

    it("should fallback to flight tips on error", async () => {
      jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.chatHistory, "create").mockImplementation((data) => data as any);

      const result = await service.chatbotResponse("user-123", "is flight bad?");
      expect(result.reply).toContain("A single flight emits");
    });

    it("should fallback to generic tips on error if no match", async () => {
      jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.chatHistory, "create").mockImplementation((data) => data as any);

      const result = await service.chatbotResponse("user-123", "hello");
      expect(result.reply).toContain("Reducing emissions starts with understanding");
    });
  });

  describe("getChatHistory", () => {
    it("should return history list", async () => {
      const mockHist = [{ id: "h1", text: "hi" }];
      jest.spyOn(prisma.chatHistory, "findMany").mockResolvedValue(mockHist as any);

      const result = await service.getChatHistory("user-123");
      expect(result).toEqual(mockHist);
      expect(prisma.chatHistory.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        orderBy: { timestamp: "asc" },
        take: 50,
      });
    });
  });
});
