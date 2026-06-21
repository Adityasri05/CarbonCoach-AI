import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Analytics Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get aggregated dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched dashboard statistics',
  })
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Req() req: { user: { id: string } }) {
    return this.analyticsService.getDashboardStats(req.user.id);
  }

  @ApiOperation({ summary: 'Get carbon emissions historical trends' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched trend line data',
  })
  @Get('trends')
  @HttpCode(HttpStatus.OK)
  async getTrends(
    @Req() req: { user: { id: string } },
    @Query('timeframe') timeframe: 'daily' | 'weekly' | 'monthly',
  ) {
    return this.analyticsService.getTrends(req.user.id, timeframe || 'weekly');
  }

  @ApiOperation({
    summary: 'Fetch projected carbon score trends based on active simulations',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched projected timelines',
  })
  @Get('projections')
  @HttpCode(HttpStatus.OK)
  async getProjections(@Req() req: { user: { id: string } }) {
    return this.analyticsService.getProjections(req.user.id);
  }
}
