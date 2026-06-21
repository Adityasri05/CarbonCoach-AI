import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        habits: true,
        leaderboard: true,
        achievements: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      habits: user.habits,
      points: user.leaderboard?.totalPoints || 0,
      achievements: user.achievements,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(
    userId: string,
    profileData: {
      name?: string;
      age?: number;
      country?: string;
      occupation?: string;
      avatarUrl?: string;
    },
    habitsData?: {
      travelDistance?: number;
      vehicleType?: string;
      fuelType?: string;
      electricityBill?: number;
      acUsage?: number;
      appliances?: string[];
      foodHabit?: string;
      shoppingFrequency?: string;
      recyclingHabits?: string;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Update User profile
      const profile = await tx.userProfile.update({
        where: { userId },
        data: {
          ...profileData,
          onboarded: true, // Mark onboarded on first patch
        },
      });

      // Update Habits if provided
      let habits = null;
      if (habitsData) {
        habits = await tx.habits.update({
          where: { userId },
          data: habitsData,
        });
      }

      return {
        profile,
        habits,
      };
    });
  }
}
