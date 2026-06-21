import { Test, TestingModule } from "@nestjs/testing";
import { CarbonService } from "./carbon.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CarbonService", () => {
  let service: CarbonService;
  let prisma: PrismaService;

  const mockPrismaService = {
    habits: {
      findUnique: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
    carbonRecord: {
      create: jest.fn(),
    },
    leaderboard: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarbonService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CarbonService>(CarbonService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should calculate correct annual footprint based on habits profile", async () => {
    const mockHabits = {
      userId: "user-123",
      travelDistance: 50,
      vehicleType: "Gasoline",
      fuelType: "Petrol",
      electricityBill: 100,
      acUsage: 2,
      appliances: [],
      foodHabit: "Vegan",
      shoppingFrequency: "Rarely",
      recyclingHabits: "Always",
    };

    jest.spyOn(prisma.habits, "findUnique").mockResolvedValue(mockHabits as any);

    const footprint = await service.calculateAnnualFootprint("user-123");
    // Transport = (50 * 365 * 0.18) / 1000 = 3.285
    // Energy = (100 * 12 * 7 * 0.4) / 1000 + (2 * 365 * 0.5) / 1000 = 3.36 + 0.365 = 3.725
    // Food = 0.6 (Vegan)
    // Shopping = 0.1 (Rarely)
    // Waste = 0.3 (Always)
    // Sum = 3.285 + 3.725 + 0.6 + 0.1 + 0.3 = 8.01 -> fixed to 8.0
    expect(footprint).toBe(8.0);
  });
});
