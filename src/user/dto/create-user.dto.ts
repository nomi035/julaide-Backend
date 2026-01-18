import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiPropertyOptional({ example: 'USA' })
  country: string;

  @ApiPropertyOptional({ example: 'USD' })
  currency: string;

  @ApiPropertyOptional({ enum: Role })
  role: Role;
}
