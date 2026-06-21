import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { CarbonService } from "./carbon.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Carbon Tracker")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("tracking")
export class CarbonController {
  constructor(private carbonService: CarbonService) {}

  @ApiOperation({ summary: "Log a new daily activity emission" })
  @ApiResponse({ status: 201, description: "Successfully logged activity" })
  @Post("log")
  @HttpCode(HttpStatus.CREATED)
  async logActivity(
    @Req() req: { user: { id: string } },
    @Body() body: { activityType: string; quantity: number; unit: string }
  ) {
    return this.carbonService.logActivity(req.user.id, body.activityType, body.quantity, body.unit);
  }

  @ApiOperation({ summary: "Retrieve recent logged activity history logs" })
  @ApiResponse({ status: 200, description: "Successfully retrieved history" })
  @Get("history")
  @HttpCode(HttpStatus.OK)
  async getHistory(@Req() req: { user: { id: string } }) {
    return this.carbonService.getHistory(req.user.id);
  }

  @ApiOperation({ summary: "Fetch total summary footprint and categories breakdown" })
  @ApiResponse({ status: 200, description: "Successfully fetched summary" })
  @Get("summary")
  @HttpCode(HttpStatus.OK)
  async getSummary(@Req() req: { user: { id: string } }) {
    return this.carbonService.getSummary(req.user.id);
  }
}
