import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    habits: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
    jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue(null);
  });

  describe('getDashboardStats', () => {
    it('should return baseline scores and breakdown', async () => {
      const mockUser = {
        id: 'u1',
        leaderboard: { totalPoints: 150 },
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.getDashboardStats('u1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        include: {
          leaderboard: true,
          habits: true,
        },
      });

      expect(result).toEqual({
        carbonScoreTons: 6.2,
        monthlyEmissionsKg: 517,
        reductionGoalPercentage: 72,
        greenPoints: 150,
        breakdown: [
          { name: 'Transportation', value: 2.6, color: '#10B981' },
          { name: 'Energy', value: 1.7, color: '#14B8A6' },
          { name: 'Food', value: 0.9, color: '#0EA5E9' },
          { name: 'Shopping', value: 0.6, color: '#F59E0B' },
          { name: 'Waste', value: 0.3, color: '#EF4444' },
        ],
      });
    });

    it('should default greenPoints to 0 if user leaderboard is missing', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ id: 'u1', leaderboard: null } as any);
      const result = await service.getDashboardStats('u1');
      expect(result.greenPoints).toBe(0);
    });
  });

  describe('getTrends', () => {
    it('should return daily trends', async () => {
      const result = await service.getTrends('u1', 'daily');
      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({ name: 'Mon', Emissions: 18 });
    });

    it('should return weekly trends', async () => {
      const result = await service.getTrends('u1', 'weekly');
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ name: 'Wk 1', Emissions: 135 });
    });

    it('should return monthly trends', async () => {
      const result = await service.getTrends('u1', 'monthly');
      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({ name: 'Jan', Emissions: 580 });
    });

    it('should return trends when habits exist', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue({ id: 'h1' } as any);
      const result = await service.getTrends('u1', 'daily');
      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({ name: 'Mon', Emissions: 18 });
    });
  });

  describe('getProjections', () => {
    it('should return static projections based on baseline target', async () => {
      const result = await service.getProjections('u1');
      expect(result).toEqual({
        currentTons: 6.2,
        targetTons: 4.8,
        reductionPct: 23,
        timeline: [
          { year: '2026', Current: 6.2, Target: 6.2 },
          { year: '2027', Current: 5.8, Target: 5.2 },
          { year: '2028', Current: 5.4, Target: 4.8 },
        ],
      });
    });

    it('should return projections when habits exist', async () => {
      jest.spyOn(prisma.habits, 'findUnique').mockResolvedValue({ id: 'h1' } as any);
      const result = await service.getProjections('u1');
      expect(result.currentTons).toBe(6.2);
    });
  });
});
