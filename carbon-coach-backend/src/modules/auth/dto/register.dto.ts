import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The user password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Alex Rivera',
    description: 'The display name of the user',
  })
  @IsString()
  name!: string;
}
