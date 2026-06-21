import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'signed-token'),
    verify: jest.fn(() => ({ sub: 'user-123' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully and return tokens', async () => {
      const dto = {
        email: 'new@example.com',
        password: 'pwd',
        name: 'New User',
      };
      const mockCreatedUser = {
        id: 'user-123',
        email: 'new@example.com',
        profile: { name: 'New User' },
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pwd' as any);
      jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(mockCreatedUser as any);

      const result = await service.register(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 'user-123',
          email: 'new@example.com',
          name: 'New User',
        },
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      const dto = {
        email: 'old@example.com',
        password: 'pwd',
        name: 'Old User',
      };
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ id: 'user-123' } as any);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate and return tokens on valid credentials', async () => {
      const dto = { email: 'user@example.com', password: 'pwd' };
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        passwordHash: 'hashed-pwd',
        profile: { name: 'User Name' },
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as any);

      const result = await service.login(dto);

      expect(result).toEqual({
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'User Name',
        },
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('should throw UnauthorizedException on invalid user or password', async () => {
      const dto = { email: 'user@example.com', password: 'pwd' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password comparison fails', async () => {
      const dto = { email: 'user@example.com', password: 'wrong-password' };
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        passwordHash: 'hashed-pwd',
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false as any);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('googleLogin', () => {
    it('should create new google user if not exists', async () => {
      const profile = {
        email: 'g@example.com',
        name: 'G Name',
        googleId: 'g123',
        picture: 'g.png',
      };
      const mockCreated = {
        id: 'u-g',
        email: 'g@example.com',
        profile: { name: 'G Name' },
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockCreated as any);

      const result = await service.googleLogin(profile);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.user.id).toBe('u-g');
    });

    it('should update user with googleId if existing user has no googleId', async () => {
      const profile = {
        email: 'g@example.com',
        name: 'G Name',
        googleId: 'g123',
        picture: 'g.png',
      };
      const mockExisting = {
        id: 'u-g',
        email: 'g@example.com',
        googleId: null,
        profile: { name: 'G Name' },
      };

      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(mockExisting as any);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockExisting,
        googleId: 'g123',
      } as any);

      const result = await service.googleLogin(profile);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-g' },
        data: { googleId: 'g123' },
        include: { profile: true },
      });
      expect(result.user.id).toBe('u-g');
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully for existing user', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({ id: 'user-123', email: 'u@example.com' } as any);

      const result = await service.refresh('refresh-token-string');

      expect(jwt.verify).toHaveBeenCalled();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('should throw UnauthorizedException if user no longer exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.refresh('refresh-token-string')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
