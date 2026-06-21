import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        profile: {
          create: {
            name: dto.name,
            onboarded: false,
          },
        },
        habits: {
          create: {
            travelDistance: 25,
            vehicleType: 'Gasoline',
            fuelType: 'Petrol',
            electricityBill: 120,
            acUsage: 4,
            appliances: ['refrigerator', 'washing_machine'],
            foodHabit: 'Non-Vegetarian',
            shoppingFrequency: 'Monthly',
            recyclingHabits: 'Sometimes',
          },
        },
        leaderboard: {
          create: {
            rank: 99,
            reductionPercentage: 0,
            totalPoints: 1250, // Starter points
          },
        },
        achievements: {
          create: {
            badgeName: 'First Step',
            badgeIcon: '🌱',
            badgeDesc: 'Joined the CarbonCoach AI platform',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.name,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.name,
      },
      ...tokens,
    };
  }

  async googleLogin(googleProfile: {
    email: string;
    name: string;
    googleId: string;
    picture?: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleProfile.email },
      include: { profile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleProfile.email,
          googleId: googleProfile.googleId,
          profile: {
            create: {
              name: googleProfile.name,
              avatarUrl: googleProfile.picture,
              onboarded: false,
            },
          },
          habits: {
            create: {
              travelDistance: 25,
              vehicleType: 'Gasoline',
              fuelType: 'Petrol',
              electricityBill: 120,
              acUsage: 4,
              appliances: ['refrigerator', 'washing_machine'],
              foodHabit: 'Non-Vegetarian',
              shoppingFrequency: 'Monthly',
              recyclingHabits: 'Sometimes',
            },
          },
          leaderboard: {
            create: {
              rank: 99,
              reductionPercentage: 0,
              totalPoints: 1250,
            },
          },
          achievements: {
            create: {
              badgeName: 'First Step',
              badgeIcon: '🌱',
              badgeDesc: 'Joined the CarbonCoach AI platform via Google',
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleProfile.googleId },
        include: { profile: true },
      });
    }

    const tokens = this.generateTokens(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.name,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'carbon-refresh-secret-12345',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'carbon-secret-key-12345',
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'carbon-refresh-secret-12345',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
