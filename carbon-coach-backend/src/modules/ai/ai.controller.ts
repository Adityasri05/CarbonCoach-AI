import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { AIService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("AI Agent")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AIController {
  constructor(private aiService: AIService) {}

  @ApiOperation({ summary: "Get or generate personalized AI emission recommendations" })
  @ApiResponse({ status: 200, description: "Successfully generated recommendations" })
  @Get("recommendations")
  @HttpCode(HttpStatus.OK)
  async getRecommendations(@Req() req: { user: { id: string } }) {
    return this.aiService.generateRecommendations(req.user.id);
  }

  @ApiOperation({ summary: "Chat with the CarbonCoach AI Assistant" })
  @ApiResponse({ status: 200, description: "Returns bot reply" })
  @Post("chat")
  @HttpCode(HttpStatus.OK)
  async chat(
    @Req() req: { user: { id: string } },
    @Body() body: { message: string }
  ) {
    return this.aiService.chatbotResponse(req.user.id, body.message);
  }

  @ApiOperation({ summary: "Retrieve user chat conversational history logs" })
  @ApiResponse({ status: 200, description: "Successfully fetched history" })
  @Get("chat/history")
  @HttpCode(HttpStatus.OK)
  async getChatHistory(@Req() req: { user: { id: string } }) {
    return this.aiService.getChatHistory(req.user.id);
  }
}
