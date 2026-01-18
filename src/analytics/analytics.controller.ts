import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto, UpdateAnalyticsDto } from './dto/analytics.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Analytics } from './entities/analytics.entity';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new analytics record' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: Analytics })
    create(@Body() createAnalyticsDto: CreateAnalyticsDto) {
        return this.analyticsService.create(createAnalyticsDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all analytics records' })
    @ApiResponse({ status: 200, description: 'Return all records.', type: [Analytics] })
    findAll() {
        return this.analyticsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an analytics record by id' })
    @ApiParam({ name: 'id', description: 'Analytics Record ID' })
    @ApiResponse({ status: 200, description: 'Return the record.', type: Analytics })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    findOne(@Param('id') id: string) {
        return this.analyticsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an analytics record' })
    @ApiParam({ name: 'id', description: 'Analytics Record ID' })
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: Analytics })
    update(@Param('id') id: string, @Body() updateAnalyticsDto: UpdateAnalyticsDto) {
        return this.analyticsService.update(id, updateAnalyticsDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an analytics record' })
    @ApiParam({ name: 'id', description: 'Analytics Record ID' })
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.analyticsService.remove(id);
    }
}
