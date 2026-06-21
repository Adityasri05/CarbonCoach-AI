import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChallengeStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    challenge: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    challengeParticipation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    leaderboard: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    achievement: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getChallenges', () => {
    it('should return joined and unjoined challenges correctly mapped', async () => {
      const mockChallenges = [
        { id: 'c1', title: 'Challenge 1', active: true },
        { id: 'c2', title: 'Challenge 2', active: true },
      ];
      const mockParticipations = [
        {
          challengeId: 'c1',
          status: ChallengeStatus.JOINED,
          daysCompleted: 2,
          progress: 50,
        },
      ];

      jest
        .spyOn(prisma.challenge, 'findMany')
        .mockResolvedValue(mockChallenges as any);
      jest
        .spyOn(prisma.challengeParticipation, 'findMany')
        .mockResolvedValue(mockParticipations as any);

      const result = await service.getChallenges('user-1');

      expect(result).toEqual([
        {
          id: 'c1',
          title: 'Challenge 1',
          active: true,
          status: 'JOINED',
          daysCompleted: 2,
          progress: 50,
        },
        {
          id: 'c2',
          title: 'Challenge 2',
          active: true,
          status: 'NOT_JOINED',
          daysCompleted: 0,
          progress: 0,
        },
      ]);
    });
  });

  describe('joinChallenge', () => {
    it('should allow a user to join an active challenge', async () => {
      const mockChallenge = { id: 'c1', active: true };
      jest
        .spyOn(prisma.challenge, 'findUnique')
        .mockResolvedValue(mockChallenge as any);
      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue(null);
      jest
        .spyOn(prisma.challengeParticipation, 'create')
        .mockResolvedValue({ id: 'p1' } as any);

      const result = await service.joinChallenge('user-1', 'c1');

      expect(prisma.challengeParticipation.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          challengeId: 'c1',
          status: ChallengeStatus.JOINED,
          progress: 0,
          daysCompleted: 0,
        },
      });
      expect(result).toEqual({ id: 'p1' });
    });

    it('should throw NotFoundException if challenge does not exist', async () => {
      jest.spyOn(prisma.challenge, 'findUnique').mockResolvedValue(null);

      await expect(service.joinChallenge('user-1', 'c-none')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user already joined', async () => {
      jest
        .spyOn(prisma.challenge, 'findUnique')
        .mockResolvedValue({ id: 'c1' } as any);
      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue({ id: 'p1' } as any);

      await expect(service.joinChallenge('user-1', 'c1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('logProgress', () => {
    it('should increment days completed and update progress percentage', async () => {
      const mockPart = {
        id: 'p1',
        status: ChallengeStatus.JOINED,
        daysCompleted: 1,
        challenge: {
          id: 'c1',
          daysTotal: 5,
          points: 100,
          title: 'Title',
          description: 'Desc',
        },
      };

      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue(mockPart as any);
      jest
        .spyOn(prisma.challengeParticipation, 'update')
        .mockResolvedValue({ id: 'p1', progress: 40 } as any);

      const result = await service.logProgress('user-1', 'c1', 1);

      expect(prisma.challengeParticipation.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: {
          daysCompleted: 2,
          progress: 40,
          status: ChallengeStatus.JOINED,
          completedAt: null,
        },
      });
      expect(result).toEqual({ id: 'p1', progress: 40 });
    });

    it('should complete challenge and award points, notification, badge when total days hit', async () => {
      const mockPart = {
        id: 'p1',
        status: ChallengeStatus.JOINED,
        daysCompleted: 4,
        challenge: {
          id: 'c1',
          daysTotal: 5,
          points: 100,
          title: 'Title',
          description: 'Desc',
        },
      };
      const mockLeaderboard = { userId: 'user-1', totalPoints: 50 };

      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue(mockPart as any);
      jest.spyOn(prisma.challengeParticipation, 'update').mockResolvedValue({
        id: 'p1',
        status: ChallengeStatus.COMPLETED,
      } as any);
      jest
        .spyOn(prisma.leaderboard, 'findUnique')
        .mockResolvedValue(mockLeaderboard as any);
      jest.spyOn(prisma.leaderboard, 'update').mockResolvedValue({} as any);
      jest.spyOn(prisma.notification, 'create').mockResolvedValue({} as any);
      jest.spyOn(prisma.achievement, 'create').mockResolvedValue({} as any);

      await service.logProgress('user-1', 'c1', 1);

      expect(prisma.challengeParticipation.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: {
          daysCompleted: 5,
          progress: 100,
          status: ChallengeStatus.COMPLETED,
          completedAt: expect.any(Date),
        },
      });
      expect(prisma.leaderboard.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { totalPoints: 150 },
      });
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'achievement',
          message: `🏆 Completed challenge: "Title"! +100 Green Points!`,
        },
      });
      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          badgeName: 'Title',
          badgeIcon: '🏆',
          badgeDesc: 'Completed: Desc',
        },
      });
    });

    it('should throw NotFoundException if participation is missing', async () => {
      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.logProgress('user-1', 'c1', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if already completed', async () => {
      const mockPart = {
        id: 'p1',
        status: ChallengeStatus.COMPLETED,
        daysCompleted: 5,
        challenge: { daysTotal: 5 },
      };
      jest
        .spyOn(prisma.challengeParticipation, 'findUnique')
        .mockResolvedValue(mockPart as any);

      await expect(service.logProgress('user-1', 'c1', 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
