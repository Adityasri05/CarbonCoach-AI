import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Eco Challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @ApiOperation({ summary: 'List all active eco challenges and user status' })
  @ApiResponse({ status: 200, description: 'Successfully fetched challenges' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getChallenges(@Req() req: { user: { id: string } }) {
    return this.challengesService.getChallenges(req.user.id);
  }

  @ApiOperation({ summary: 'Join a weekly sustainability challenge' })
  @ApiResponse({ status: 201, description: 'Successfully joined challenge' })
  @Post('join')
  @HttpCode(HttpStatus.CREATED)
  async joinChallenge(
    @Req() req: { user: { id: string } },
    @Body() body: { challengeId: string },
  ) {
    return this.challengesService.joinChallenge(req.user.id, body.challengeId);
  }

  @ApiOperation({ summary: 'Log days progress towards a joined challenge' })
  @ApiResponse({ status: 200, description: 'Successfully updated progress' })
  @Post('complete')
  @HttpCode(HttpStatus.OK)
  async logProgress(
    @Req() req: { user: { id: string } },
    @Body() body: { challengeId: string; daysCompleted: number },
  ) {
    return this.challengesService.logProgress(
      req.user.id,
      body.challengeId,
      body.daysCompleted || 1,
    );
  }
}
