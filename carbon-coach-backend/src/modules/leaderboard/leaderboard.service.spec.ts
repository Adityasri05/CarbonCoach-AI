import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let prisma: PrismaService;

  const mockPrismaService = {
    leaderboard: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('should fetch, rank, and format leaderboard participants', async () => {
      const mockList = [
        {
          userId: 'u1',
          reductionPercentage: 80,
          totalPoints: 500,
          user: {
            profile: {
              name: 'Alice',
              avatarUrl: 'alice.png',
            },
          },
        },
        {
          userId: 'u2',
          reductionPercentage: 60,
          totalPoints: 300,
          user: {
            profile: null,
          },
        },
      ];

      jest
        .spyOn(prisma.leaderboard, 'findMany')
        .mockResolvedValue(mockList as any);

      const result = await service.getLeaderboard();

      expect(prisma.leaderboard.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: [{ reductionPercentage: 'desc' }, { totalPoints: 'desc' }],
        take: 50,
      });

      expect(result).toEqual([
        {
          rank: 1,
          userId: 'u1',
          name: 'Alice',
          avatarUrl: 'alice.png',
          reductionPercentage: 80,
          totalPoints: 500,
        },
        {
          rank: 2,
          userId: 'u2',
          name: 'Eco Participant',
          avatarUrl: undefined,
          reductionPercentage: 60,
          totalPoints: 300,
        },
      ]);
    });
  });
});
