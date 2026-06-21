import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    updateProfile(req: {
        user: {
            id: string;
        };
    }, body: {
        profile?: {
            name?: string;
            age?: number;
            country?: string;
            occupation?: string;
            avatarUrl?: string;
        };
        habits?: {
            travelDistance?: number;
            vehicleType?: string;
            fuelType?: string;
            electricityBill?: number;
            acUsage?: number;
            appliances?: string[];
            foodHabit?: string;
            shoppingFrequency?: string;
            recyclingHabits?: string;
        };
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
