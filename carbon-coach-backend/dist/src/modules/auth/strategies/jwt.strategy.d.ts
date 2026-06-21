import { Strategy } from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        email: string;
        googleId: string | null;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
}
export {};
