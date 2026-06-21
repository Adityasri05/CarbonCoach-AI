import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

// Custom Modules
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CarbonModule } from "./modules/carbon/carbon.module";
import { AIModule } from "./modules/ai/ai.module";
import { TwinModule } from "./modules/twin/twin.module";
import { CameraModule } from "./modules/camera/camera.module";
import { ChallengesModule } from "./modules/challenges/challenges.module";
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module";
import { RewardsModule } from "./modules/rewards/rewards.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { MetricsModule } from "./modules/metrics/metrics.module";

@Module({
  imports: [
    // Rate Limiting (100 requests per 1 minute)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core Database & Sub-modules
    PrismaModule,
    AuthModule,
    UserModule,
    CarbonModule,
    AIModule,
    TwinModule,
    CameraModule,
    ChallengesModule,
    LeaderboardModule,
    RewardsModule,
    AnalyticsModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable rate limiting globally across all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
