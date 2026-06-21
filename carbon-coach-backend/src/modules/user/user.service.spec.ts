import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    userProfile: {
      update: jest.fn(),
    },
    habits: {
      update: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile formatting if user exists', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
        createdAt: new Date(),
        profile: { name: 'Test User' },
        habits: { foodHabit: 'Vegan' },
        leaderboard: { totalPoints: 120 },
        achievements: [{ badgeName: 'First Badge' }],
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.getProfile('user-1');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        profile: mockUser.profile,
        habits: mockUser.habits,
        points: 120,
        achievements: mockUser.achievements,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getProfile('user-none')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile and habits inside a transaction', async () => {
      const userId = 'user-1';
      const profileData = { name: 'New Name' };
      const habitsData = { foodHabit: 'Vegetarian' };

      jest
        .spyOn(prisma.userProfile, 'update')
        .mockResolvedValue({ userId, name: 'New Name' } as any);
      jest
        .spyOn(prisma.habits, 'update')
        .mockResolvedValue({ userId, foodHabit: 'Vegetarian' } as any);

      const result = await service.updateProfile(
        userId,
        profileData,
        habitsData,
      );

      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId },
        data: { name: 'New Name', onboarded: true },
      });
      expect(prisma.habits.update).toHaveBeenCalledWith({
        where: { userId },
        data: habitsData,
      });
      expect(result).toEqual({
        profile: { userId, name: 'New Name' },
        habits: { userId, foodHabit: 'Vegetarian' },
      });
    });

    it('should update profile only if habitsData is not provided', async () => {
      const userId = 'user-1';
      const profileData = { name: 'New Name' };

      jest
        .spyOn(prisma.userProfile, 'update')
        .mockResolvedValue({ userId, name: 'New Name' } as any);

      const result = await service.updateProfile(userId, profileData);

      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId },
        data: { name: 'New Name', onboarded: true },
      });
      expect(prisma.habits.update).not.toHaveBeenCalled();
      expect(result.habits).toBeNull();
    });
  });
});
