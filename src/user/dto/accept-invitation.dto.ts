import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
    @ApiProperty({ example: 'abc123token', description: 'Invitation token received' })
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty({ example: 'Jane Doe', description: 'Full name of the team member' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'securePassword123', description: 'Password for the new account' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    @IsNotEmpty()
    @IsString()
    phone: string;
}
