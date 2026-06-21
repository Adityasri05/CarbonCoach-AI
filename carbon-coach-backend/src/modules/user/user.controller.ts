import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('User Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Fetch current user profile, habits, achievements' })
  @ApiResponse({ status: 200, description: 'Successfully fetched' })
  @ApiResponse({ status: 401, description: 'Unauthorized access token' })
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: { user: { id: string } }) {
    return this.userService.getProfile(req.user.id);
  }

  @ApiOperation({
    summary: 'Update user profile metadata and onboarding habits',
  })
  @ApiResponse({ status: 200, description: 'Successfully updated profile' })
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body()
    body: {
      profile?: {
        name?: string;
        age?: number;
        country?: string;
        occupation?: string;
        avatarUrl?: string;
      };
      habits?: {
        travelDistance?: number;
        vehicleType?: string;
        fuelType?: string;
        electricityBill?: number;
        acUsage?: number;
        appliances?: string[];
        foodHabit?: string;
        shoppingFrequency?: string;
        recyclingHabits?: string;
      };
    },
  ) {
    return this.userService.updateProfile(
      req.user.id,
      body.profile || {},
      body.habits,
    );
  }
}
