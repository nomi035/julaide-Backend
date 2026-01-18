import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeploymentPlatform } from '../entities/website.entity';

export class CreateWebsiteDto {
    @ApiProperty({ example: 'example.com' })
    domain: string;

    @ApiPropertyOptional({ enum: DeploymentPlatform, default: DeploymentPlatform.OTHER })
    deploymentPlatform?: DeploymentPlatform;

    @ApiPropertyOptional({ example: 'prop_123' })
    darkVisitorPropertyId?: string;

    @ApiProperty({ example: 'user-uuid-here' })
    userId: string;
}

export class UpdateWebsiteDto {
    @ApiPropertyOptional({ example: 'example.com' })
    domain?: string;

    @ApiPropertyOptional({ enum: DeploymentPlatform })
    deploymentPlatform?: DeploymentPlatform;

    @ApiPropertyOptional({ example: 'prop_123' })
    darkVisitorPropertyId?: string;

    @ApiPropertyOptional({ example: 'active', enum: ['pending', 'active', 'failed'] })
    status?: 'pending' | 'active' | 'failed';
}
