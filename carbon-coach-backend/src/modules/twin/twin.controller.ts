import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { TwinService } from "./twin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Carbon Twin AI")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("carbon-twin")
export class TwinController {
  constructor(private twinService: TwinService) {}

  @ApiOperation({ summary: "Simulate a future lifestyle change scenario" })
  @ApiResponse({ status: 200, description: "Successfully simulated scenario" })
  @Post("simulate")
  @HttpCode(HttpStatus.OK)
  async simulate(
    @Req() req: { user: { id: string } },
    @Body()
    body: {
      scenarioName: string;
      transportSlider: number;
      energySlider: number;
      foodSlider: string;
      flightsSlider: number;
    }
  ) {
    return this.twinService.simulate(
      req.user.id,
      body.scenarioName,
      body.transportSlider,
      body.energySlider,
      body.foodSlider,
      body.flightsSlider
    );
  }

  @ApiOperation({ summary: "Retrieve carbon twin simulations history logs" })
  @ApiResponse({ status: 200, description: "Successfully retrieved history" })
  @Get("history")
  @HttpCode(HttpStatus.OK)
  async getHistory(@Req() req: { user: { id: string } }) {
    return this.twinService.getHistory(req.user.id);
  }
}
