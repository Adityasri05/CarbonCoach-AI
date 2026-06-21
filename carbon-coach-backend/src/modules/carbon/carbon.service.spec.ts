import { Test, TestingModule } from '@nestjs/testing';
import { CarbonService } from './carbon.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityCategory } from '@prisma/client';

describe('CarbonService', () => {
  let service: CarbonService;
  let prisma: PrismaService;

  const mockPrismaService = {
    habits: {
      findUnique: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    carbonRecord: {
      create: jest.fn(),
      groupBy: jest.fn(),
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
    jest.clearAllMocks();
  });

  describe('calculateAnnualFootprint', () => {
    it('should calculate correct annual footprint based on habits profile', async () => {
      const mockHabits = {
        userId: 'user-123',
        travelDistance: 50,
        vehicleType: 'Gasoline',
        fuelType: 'Petrol',
        electricityBill: 100,
        acUsage: 2,
        appliances: [],
        foodHabit: 'Vegan',
        shoppingFrequency: 'Rarely',
        recyclingHabits: 'Always',
      };

      jest
        .spyOn(prisma.habits, 'findUnique')
        .mockResolvedValue(mockHabits as any);

      const footprint = await service.calculateAnnualFootprint('user-123');
      expect(footprint).toBe(8.0);
    });

    it('should return default footprint when habits are not found', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
      const footprint = await service.calculateAnnualFootprint('user-123');
      expect(footprint).toBe(6.2);
    });
  });

  describe('logActivity', () => {
    it('should log activity and award leaderboard points', async () => {
      const userId = 'user-123';
      const activityType = 'car_trip';
      const quantity = 10;
      const unit = 'km';

      const mockLog = {
        id: 'log-1',
        userId,
        activityType,
        quantity,
        unit,
        emissionsCalculated: 1.8,
      };
      const mockLeaderboard = { userId, totalPoints: 100 };

      jest
        .spyOn(prisma.activityLog, 'create')
        .mockResolvedValue(mockLog as any);
      jest
        .spyOn(prisma.leaderboard, 'findUnique')
        .mockResolvedValue(mockLeaderboard as any);
      jest
        .spyOn(prisma.leaderboard, 'update')
        .mockResolvedValue(mockLeaderboard as any);

      const result = await service.logActivity(
        userId,
        activityType,
        quantity,
        unit,
      );

      expect(prisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          activityType,
          quantity,
          unit,
          emissionsCalculated: 1.8,
        },
      });
      expect(prisma.carbonRecord.create).toHaveBeenCalledWith({
        data: {
          userId,
          category: ActivityCategory.TRANSPORTATION,
          emissions: 1.8,
        },
      });
      expect(prisma.leaderboard.update).toHaveBeenCalledWith({
        where: { userId },
        data: { totalPoints: 115 },
      });
      expect(result.pointsAwarded).toBe(15);
      expect(result.log).toEqual(mockLog);
    });

    it('should fallback on default emissions calculation for unknown activities', async () => {
      const userId = 'user-123';
      const activityType = 'unknown_act';
      const quantity = 5;
      const unit = 'times';

      jest.spyOn(prisma.activityLog, 'create').mockResolvedValue({} as any);
      jest.spyOn(prisma.leaderboard, 'findUnique').mockResolvedValue(null);

      await service.logActivity(userId, activityType, quantity, unit);

      expect(prisma.activityLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emissionsCalculated: 0.5,
          }),
        }),
      );
    });
  });

  describe('getHistory', () => {
    it('should retrieve recent activities', async () => {
      const userId = 'user-123';
      const mockHistory = [{ id: 'log-1' }, { id: 'log-2' }];
      jest
        .spyOn(prisma.activityLog, 'findMany')
        .mockResolvedValue(mockHistory as any);

      const result = await service.getHistory(userId);
      expect(result).toEqual(mockHistory);
      expect(prisma.activityLog.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 20,
      });
    });
  });

  describe('getSummary', () => {
    it('should return the formatted summary breakdown', async () => {
      const userId = 'user-123';
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null); // returns 6.2 baseline
      jest.spyOn(prisma.carbonRecord, 'groupBy').mockResolvedValue([
        {
          category: ActivityCategory.TRANSPORTATION,
          _sum: { emissions: 12.5 },
        },
        { category: ActivityCategory.ENERGY, _sum: { emissions: 8.0 } },
      ] as any);

      const result = await service.getSummary(userId);
      expect(result).toEqual({
        annualFootprintTons: 6.2,
        monthlyEmissionsKg: 517, // Math.round((6.2 * 1000) / 12) = 517
        categoryBreakdown: [
          { category: ActivityCategory.TRANSPORTATION, totalEmissions: 12.5 },
          { category: ActivityCategory.ENERGY, totalEmissions: 8.0 },
        ],
        reductionGoalPercentage: 72,
      });
    });
  });
});
