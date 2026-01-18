export class CreateAnalyticsDto {
    websiteId: string;
    totalVisitors?: number;
    botTrafficCount?: number;
    botTypeBreakdown?: any;
}

export class UpdateAnalyticsDto {
    totalVisitors?: number;
    botTrafficCount?: number;
    botTypeBreakdown?: any;
}
