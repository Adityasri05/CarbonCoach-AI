import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user profile' })
  @ApiResponse({ status: 201, description: 'Successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation inputs error' })
  @ApiResponse({ status: 499, description: 'Conflict email registered' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login credentials standard email authentication' })
  @ApiResponse({
    status: 200,
    description: 'Login success, returns access & refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Authenticate / Exchange Google OAuth access credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Google registration/login success',
  })
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body()
    body: {
      email: string;
      name: string;
      googleId: string;
      picture?: string;
    },
  ) {
    return this.authService.googleLogin(body);
  }

  @ApiOperation({ summary: 'Refresh JWT Access Token rotation' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access & refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Invalidate sessions / Logout' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    // In production, we can store refresh tokens in a Redis blocklist.
    return { success: true, message: 'Successfully logged out' };
  }
}
