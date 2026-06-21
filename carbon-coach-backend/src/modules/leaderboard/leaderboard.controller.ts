import { Controller, Get, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Community Leaderboard")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("leaderboard")
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @ApiOperation({ summary: "Retrieve global carbon reduction standings" })
  @ApiResponse({ status: 200, description: "Successfully fetched leaderboard standings" })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }
}
