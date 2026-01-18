import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class InviteTeamMemberDto {
    @ApiProperty({ example: 'Jane Doe', description: 'Team member name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'team@example.com', description: 'Team member email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Team member password' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'Team member phone' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiPropertyOptional({ example: '123 Street', description: 'Team member address' })
    @IsOptional()
    @IsString()
    address?: string;
}
