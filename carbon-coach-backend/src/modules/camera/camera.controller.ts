import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { CameraService } from "./camera.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Carbon Impact Camera")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("camera")
export class CameraController {
  constructor(private cameraService: CameraService) {}

  @ApiOperation({ summary: "Analyze image to detect item carbon emissions" })
  @ApiResponse({ status: 200, description: "Successfully analyzed image" })
  @Post("analyze")
  @HttpCode(HttpStatus.OK)
  async analyze(
    @Req() req: { user: { id: string } },
    @Body() body: { category: string; imageUrl: string }
  ) {
    return this.cameraService.analyzeImage(req.user.id, body.category, body.imageUrl);
  }

  @ApiOperation({ summary: "Retrieve recent vision scans history logs" })
  @ApiResponse({ status: 200, description: "Successfully fetched scans" })
  @Get("history")
  @HttpCode(HttpStatus.OK)
  async getHistory(@Req() req: { user: { id: string } }) {
    return this.cameraService.getRecentScans(req.user.id);
  }
}
