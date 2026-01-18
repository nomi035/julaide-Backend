import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntegrationPlatform, IntegrationType, BackendOption, IntegrationMethod } from '../entities/website.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWebsiteDto {
    @ApiProperty({ example: 'My Website' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'example.com' })
    @IsNotEmpty()
    @IsString()
    domain: string;

    @ApiProperty({ enum: IntegrationPlatform })
    @IsEnum(IntegrationPlatform)
    integrationPlatform: IntegrationPlatform;

    @ApiProperty({ enum: IntegrationType })
    @IsEnum(IntegrationType)
    integrationType: IntegrationType;

    @ApiPropertyOptional({ enum: BackendOption })
    @IsOptional()
    @IsEnum(BackendOption)
    backendOption?: BackendOption;

    @ApiPropertyOptional({ example: 'JavaScript tag' })
    @IsOptional()
    @IsString()
    frontendOption?: string;

    @ApiProperty({ enum: IntegrationMethod, default: IntegrationMethod.SELF })
    @IsEnum(IntegrationMethod)
    website_integration_method: IntegrationMethod;

    @ApiPropertyOptional({ example: 'prop_123' })
    @IsOptional()
    @IsString()
    darkVisitorPropertyId?: string;

    @ApiProperty({ example: 'user-uuid-here' })
    @IsNotEmpty()
    @IsString()
    userId: string;
}

export class UpdateWebsiteDto {
    @ApiPropertyOptional({ example: 'My Website' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'example.com' })
    @IsOptional()
    @IsString()
    domain?: string;

    @ApiPropertyOptional({ enum: IntegrationPlatform })
    @IsOptional()
    @IsEnum(IntegrationPlatform)
    integrationPlatform?: IntegrationPlatform;

    @ApiPropertyOptional({ enum: IntegrationType })
    @IsOptional()
    @IsEnum(IntegrationType)
    integrationType?: IntegrationType;

    @ApiPropertyOptional({ enum: BackendOption })
    @IsOptional()
    @IsEnum(BackendOption)
    backendOption?: BackendOption;

    @ApiPropertyOptional({ example: 'JavaScript tag' })
    @IsOptional()
    @IsString()
    frontendOption?: string;

    @ApiPropertyOptional({ enum: IntegrationMethod })
    @IsOptional()
    @IsEnum(IntegrationMethod)
    website_integration_method?: IntegrationMethod;

    @ApiPropertyOptional({ example: 'prop_123' })
    @IsOptional()
    @IsString()
    darkVisitorPropertyId?: string;

    @ApiPropertyOptional({ example: 'active', enum: ['pending', 'active', 'failed'] })
    @IsOptional()
    status?: 'pending' | 'active' | 'failed';
}
