import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class OnboardClientDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the client' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'client@example.com', description: 'Client email address' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Client password' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'Client phone number' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiPropertyOptional({ example: '123 Business St', description: 'Client address' })
    @IsOptional()
    @IsString()
    address?: string;
}
