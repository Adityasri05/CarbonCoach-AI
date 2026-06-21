import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Rewards Marketplace")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("rewards")
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @ApiOperation({ summary: "List all active rewards in the marketplace" })
  @ApiResponse({ status: 200, description: "Successfully fetched rewards" })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getRewards() {
    return this.rewardsService.getRewards();
  }

  @ApiOperation({ summary: "Redeem a reward using Green Points" })
  @ApiResponse({ status: 200, description: "Successfully redeemed reward" })
  @ApiResponse({ status: 400, description: "Insufficient points" })
  @Post("redeem")
  @HttpCode(HttpStatus.OK)
  async redeem(
    @Req() req: { user: { id: string } },
    @Body() body: { rewardId: string }
  ) {
    return this.rewardsService.redeemReward(req.user.id, body.rewardId);
  }
}
