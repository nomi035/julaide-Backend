import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalyticsDto {
    @ApiProperty({ example: 'website-uuid-here' })
    websiteId: string;

    @ApiPropertyOptional({ example: 100 })
    totalVisitors?: number;

    @ApiPropertyOptional({ example: 10 })
    botTrafficCount?: number;

    @ApiPropertyOptional({ example: { 'AI Crawler': 5 } })
    botTypeBreakdown?: any;
}

export class UpdateAnalyticsDto {
    @ApiPropertyOptional({ example: 150 })
    totalVisitors?: number;

    @ApiPropertyOptional({ example: 20 })
    botTrafficCount?: number;

    @ApiPropertyOptional({ example: { 'AI Crawler': 10 } })
    botTypeBreakdown?: any;
}
