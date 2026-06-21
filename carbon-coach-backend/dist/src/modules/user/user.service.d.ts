import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        profile: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            age: number | null;
            country: string;
            occupation: string | null;
            avatarUrl: string | null;
            onboarded: boolean;
            userId: string;
        } | null;
        habits: {
            id: string;
            updatedAt: Date;
            travelDistance: number;
            vehicleType: string;
            fuelType: string;
            electricityBill: number;
            acUsage: number;
            appliances: string[];
            foodHabit: string;
            shoppingFrequency: string;
            recyclingHabits: string;
            userId: string;
        } | null;
        points: number;
        achievements: {
            id: string;
            badgeName: string;
            badgeIcon: string;
            badgeDesc: string;
            unlockedAt: Date;
            userId: string;
        }[];
        createdAt: Date;
    }>;
    updateProfile(userId: string, profileData: {
        name?: string;
        age?: number;
        country?: string;
        occupation?: string;
        avatarUrl?: string;
    }, habitsData?: {
        travelDistance?: number;
        vehicleType?: string;
        fuelType?: string;
        electricityBill?: number;
        acUsage?: number;
        appliances?: string[];
        foodHabit?: string;
        shoppingFrequency?: string;
        recyclingHabits?: string;
    }): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            age: number | null;
            country: string;
            occupation: string | null;
            avatarUrl: string | null;
            onboarded: boolean;
            userId: string;
        };
        habits: {
            id: string;
            updatedAt: Date;
            travelDistance: number;
            vehicleType: string;
            fuelType: string;
            electricityBill: number;
            acUsage: number;
            appliances: string[];
            foodHabit: string;
            shoppingFrequency: string;
            recyclingHabits: string;
            userId: string;
        } | null;
    }>;
}
