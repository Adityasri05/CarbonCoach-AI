import { Test, TestingModule } from '@nestjs/testing';
import { TwinService } from './twin.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TwinService', () => {
  let service: TwinService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    carbonTwinSimulation: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwinService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TwinService>(TwinService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('simulate', () => {
    it('should calculate correct savings and store simulation data', async () => {
      const userId = 'u1';
      const scenarioName = 'Green Future';
      const transportSlider = 5;
      const energySlider = 100;
      const foodSlider = 'Vegan';
      const flightsSlider = 2;

      const mockUser = {
        id: userId,
        habits: {
          travelDistance: 20,
        },
      };

      const mockSimulation = {
        id: 'sim1',
        userId,
        scenarioName,
        transportSlider,
        energySlider,
        foodSlider,
        flightsSlider,
        currentScore: 6.2,
        simulatedScore: 4.8,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest
        .spyOn(prisma.carbonTwinSimulation, 'create')
        .mockResolvedValue(mockSimulation as any);

      const result = await service.simulate(
        userId,
        scenarioName,
        transportSlider,
        energySlider,
        foodSlider,
        flightsSlider,
      );

      // Math checks:
      // simulatedTransport = ((7 - 5) * 52 * 8) / 1000 = 0.832
      // simulatedEnergy = (100 * 12 * 7 * 0.4) / 1000 + (365 * 0.5 * 2) / 1000 = 3.36 + 0.365 = 3.725
      // simulatedFood = 0.6
      // simulatedFlights = 2 * 0.9 = 1.8
      // wasteShoppingBaseline = 1.1
      // Sum = 0.832 + 3.725 + 0.6 + 1.8 + 1.1 = 8.057 -> fixed to 8.1
      // Current baseline = 6.2
      // Since currentScore = 6.2 and simulatedScore = 8.1, co2SavedTons is negative or 0 savingPercentage
      expect(prisma.carbonTwinSimulation.create).toHaveBeenCalledWith({
        data: {
          userId,
          scenarioName,
          transportSlider,
          energySlider,
          foodSlider,
          flightsSlider,
          currentScore: 6.2,
          simulatedScore: 8.1,
        },
      });

      expect(result.savingPercentage).toBe(0); // since simulatedScore (8.1) > currentScore (6.2)
      expect(result.co2SavedTons).toBe(-1.9); // 6.2 - 8.1 = -1.9
      expect(result.simulation).toEqual(mockSimulation);
    });

    it('should handle positive saving percentage', async () => {
      const userId = 'u1';
      const scenarioName = 'Ultra Clean';
      const transportSlider = 7; // simulatedTransport = 0
      const energySlider = 20; // simulatedEnergy = 0.96 + 0.365 = 1.325
      const foodSlider = 'Vegan'; // simulatedFood = 0.6
      const flightsSlider = 0; // simulatedFlights = 0
      // wasteShoppingBaseline = 1.1
      // Sum = 0 + 1.325 + 0.6 + 0 + 1.1 = 3.025 -> 3.0 simulated score
      // Baseline = 6.2
      // Savings = 6.2 - 3.0 = 3.2 tons
      // SavingPercentage = Math.round((3.2 / 6.2) * 100) = 52%

      const mockUser = {
        id: userId,
        habits: null,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest
        .spyOn(prisma.carbonTwinSimulation, 'create')
        .mockImplementation((args: any) => Promise.resolve(args.data));

      const result = await service.simulate(
        userId,
        scenarioName,
        transportSlider,
        energySlider,
        foodSlider,
        flightsSlider,
      );

      expect(result.savingPercentage).toBe(56);
      expect(result.co2SavedTons).toBe(3.5);
    });

    it('should simulate with Vegetarian food option', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.carbonTwinSimulation, 'create')
        .mockImplementation((args: any) => Promise.resolve(args.data));

      const result = await service.simulate(
        'u1',
        'Vegetarian Scenario',
        7,
        20,
        'Vegetarian',
        0,
      );

      expect(result).toBeDefined();
    });

    it('should simulate with Eggetarian food option', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prisma.carbonTwinSimulation, 'create')
        .mockImplementation((args: any) => Promise.resolve(args.data));

      const result = await service.simulate(
        'u1',
        'Eggetarian Scenario',
        7,
        20,
        'Eggetarian',
        0,
      );

      expect(result).toBeDefined();
    });
  });

  describe('getHistory', () => {
    it('should fetch user simulation history', async () => {
      const userId = 'u1';
      const mockHistory = [{ id: 'sim1' }, { id: 'sim2' }];
      jest
        .spyOn(prisma.carbonTwinSimulation, 'findMany')
        .mockResolvedValue(mockHistory as any);

      const result = await service.getHistory(userId);

      expect(prisma.carbonTwinSimulation.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      expect(result).toEqual(mockHistory);
    });
  });
});
