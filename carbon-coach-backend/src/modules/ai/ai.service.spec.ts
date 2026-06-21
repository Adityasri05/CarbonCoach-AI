import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleGenAI } from '@google/genai';

// Mock @google/genai SDK
const mockGenerateContent = jest.fn().mockResolvedValue({
  text: 'Mocked Gemini chatbot response',
});

jest.mock('@google/genai', () => {
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

describe('AIService', () => {
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
    mockGenerateContent.mockResolvedValue({
      text: 'Mocked Gemini chatbot response',
    });
    jest.clearAllMocks();
  });

  it('should generate correct recommendations based on user habits', async () => {
    const mockHabits = {
      userId: 'user-123',
      vehicleType: 'Gasoline',
      travelDistance: 20,
      acUsage: 4,
      foodHabit: 'Non-Vegetarian',
      recyclingHabits: 'Sometimes',
    };

    jest
      .spyOn(prisma.habits, 'findUnique')
      .mockResolvedValue(mockHabits as any);
    jest
      .spyOn(prisma.recommendation, 'create')
      .mockImplementation((data) => data as any);

    const recs = await service.generateRecommendations('user-123');
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].text).toContain('public transport');
  });

  it('should process user queries and generate bot response with habits and chat history', async () => {
    const mockHabits = {
      userId: 'user-123',
      vehicleType: 'Gasoline',
      travelDistance: 20,
      acUsage: 4,
      foodHabit: 'Non-Vegetarian',
      recyclingHabits: 'Sometimes',
      electricityBill: 100,
      shoppingFrequency: 'Monthly',
    };
    const mockHistory = [
      { id: 'h1', sender: 'USER', text: 'hello' },
      { id: 'h2', sender: 'BOT', text: 'hi' },
    ];
    jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(mockHabits as any);
    jest.spyOn(prisma.chatHistory, 'findMany').mockResolvedValue(mockHistory as any);
    jest
      .spyOn(prisma.chatHistory, 'create')
      .mockImplementation((data) => data as any);

    const result = await service.chatbotResponse(
      'user-123',
      'How can I reduce emissions?',
    );
    expect(result.reply).toBe('Mocked Gemini chatbot response');
    expect(prisma.chatHistory.create).toHaveBeenCalledTimes(2);
  });

  it('should fall back to default message if Gemini returns empty text', async () => {
    jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.chatHistory, 'findMany').mockResolvedValue([]);
    jest
      .spyOn(prisma.chatHistory, 'create')
      .mockImplementation((data) => data as any);
    mockGenerateContent.mockResolvedValue({ text: '' });

    const result = await service.chatbotResponse(
      'user-123',
      'How can I reduce emissions?',
    );
    expect(result.reply).toContain("I'm sorry, I couldn't generate a response");
  });

  describe('chatbot fallback', () => {
    beforeEach(() => {
      mockGenerateContent.mockRejectedValue(new Error('Gemini API is down'));
    });

    it('should fallback to reduce emissions tips on error', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.chatHistory, 'create')
        .mockImplementation((data) => data as any);

      const result = await service.chatbotResponse(
        'user-123',
        'how can i reduce emissions?',
      );
      expect(result.reply).toContain('To lower your carbon footprint');
      expect(prisma.chatHistory.create).toHaveBeenCalledTimes(2);
    });

    it('should fallback to cycling tips on error', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.chatHistory, 'create')
        .mockImplementation((data) => data as any);

      const result = await service.chatbotResponse(
        'user-123',
        'should I use a bike?',
      );
      expect(result.reply).toContain('Cycling generates 0g');
    });

    it('should fallback to flight tips on error', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.chatHistory, 'create')
        .mockImplementation((data) => data as any);

      const result = await service.chatbotResponse(
        'user-123',
        'is flight bad?',
      );
      expect(result.reply).toContain('A single flight emits');
    });

    it('should fallback to generic tips on error if no match', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.chatHistory, 'create')
        .mockImplementation((data) => data as any);

      const result = await service.chatbotResponse('user-123', 'hello');
      expect(result.reply).toContain(
        'Reducing emissions starts with understanding',
      );
    });
  });

  describe('getChatHistory', () => {
    it('should return history list', async () => {
      const mockHist = [{ id: 'h1', text: 'hi' }];
      jest
        .spyOn(prisma.chatHistory, 'findMany')
        .mockResolvedValue(mockHist as any);

      const result = await service.getChatHistory('user-123');
      expect(result).toEqual(mockHist);
      expect(prisma.chatHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { timestamp: 'asc' },
        take: 50,
      });
    });
  });

  describe('additional branch coverage', () => {
    it('should handle alternate/negative recommendation branches', async () => {
      const mockHabits = {
        userId: 'user-123',
        vehicleType: 'Electric',
        travelDistance: 10,
        acUsage: 1,
        foodHabit: 'Vegan',
        recyclingHabits: 'Always',
      };

      jest
        .spyOn(prisma.habits, 'findUnique')
        .mockResolvedValue(mockHabits as any);

      const recs = await service.generateRecommendations('user-123');
      expect(recs.length).toBe(0);
    });

    it('should handle Diesel vehicleType recommendation branch', async () => {
      const mockHabits = {
        userId: 'user-123',
        vehicleType: 'Diesel',
        travelDistance: 10,
        acUsage: 1,
        foodHabit: 'Vegan',
        recyclingHabits: 'Always',
      };

      jest
        .spyOn(prisma.habits, 'findUnique')
        .mockResolvedValue(mockHabits as any);

      const recs = await service.generateRecommendations('user-123');
      expect(recs.length).toBe(1);
      expect(recs[0].text).toContain('public transport');
    });

    it('should fallback to defaults in chatbotResponse systemInstruction when habits fields are missing', async () => {
      const mockHabitsEmpty = {
        userId: 'user-123',
        vehicleType: '',
        travelDistance: 0,
        electricityBill: 0,
        acUsage: 0,
        foodHabit: '',
        shoppingFrequency: '',
        recyclingHabits: '',
      };
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(mockHabitsEmpty as any);
      jest.spyOn(prisma.chatHistory, 'findMany').mockResolvedValue([]);
      jest
        .spyOn(prisma.chatHistory, 'create')
        .mockImplementation((data) => data as any);

      const result = await service.chatbotResponse(
        'user-123',
        'Hello',
      );
      expect(result.reply).toBe('Mocked Gemini chatbot response');
    });
  });
});
