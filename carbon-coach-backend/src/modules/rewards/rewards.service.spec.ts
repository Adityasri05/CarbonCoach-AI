import { Test, TestingModule } from "@nestjs/testing";
import { RewardsService } from "./rewards.service";
import { PrismaService } from "../../prisma/prisma.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";

describe("RewardsService", () => {
  let service: RewardsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    reward: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    leaderboard: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    rewardTransaction: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe("getRewards", () => {
    it("should return all active rewards", async () => {
      const mockRewards = [{ id: "r1", title: "Free Coffee", active: true }];
      jest.spyOn(prisma.reward, "findMany").mockResolvedValue(mockRewards as any);

      const result = await service.getRewards();
      expect(result).toEqual(mockRewards);
      expect(prisma.reward.findMany).toHaveBeenCalledWith({
        where: { active: true },
      });
    });
  });

  describe("redeemReward", () => {
    it("should deduct points and create a transaction/notification on success", async () => {
      const userId = "u1";
      const rewardId = "r1";
      const mockReward = { id: rewardId, title: "Coffee", pointsRequired: 50 };
      const mockLeaderboard = { userId, totalPoints: 120 };
      const mockTx = { id: "tx1", userId, rewardId, pointsSpent: 50 };

      jest.spyOn(prisma.reward, "findUnique").mockResolvedValue(mockReward as any);
      jest.spyOn(prisma.leaderboard, "findUnique").mockResolvedValue(mockLeaderboard as any);
      jest.spyOn(prisma.leaderboard, "update").mockResolvedValue({} as any);
      jest.spyOn(prisma.rewardTransaction, "create").mockResolvedValue(mockTx as any);
      jest.spyOn(prisma.notification, "create").mockResolvedValue({} as any);

      const result = await service.redeemReward(userId, rewardId);

      expect(prisma.leaderboard.update).toHaveBeenCalledWith({
        where: { userId },
        data: { totalPoints: 70 },
      });
      expect(prisma.rewardTransaction.create).toHaveBeenCalledWith({
        data: {
          userId,
          rewardId,
          pointsSpent: 50,
        },
      });
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId,
          type: "success",
          message: `🎁 Redeemed: "Coffee"! Deducted 50 pts.`,
        },
      });
      expect(result).toEqual({
        transaction: mockTx,
        remainingPoints: 70,
      });
    });

    it("should throw NotFoundException if reward is missing", async () => {
      jest.spyOn(prisma.reward, "findUnique").mockResolvedValue(null);

      await expect(service.redeemReward("u1", "r-none")).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException if user has insufficient points", async () => {
      const mockReward = { id: "r1", title: "Coffee", pointsRequired: 100 };
      const mockLeaderboard = { userId: "u1", totalPoints: 40 };

      jest.spyOn(prisma.reward, "findUnique").mockResolvedValue(mockReward as any);
      jest.spyOn(prisma.leaderboard, "findUnique").mockResolvedValue(mockLeaderboard as any);

      await expect(service.redeemReward("u1", "r1")).rejects.toThrow(BadRequestException);
    });
  });
});
