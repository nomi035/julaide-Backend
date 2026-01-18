import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Website } from './entities/website.entity';

@ApiTags('Websites')
@Controller('websites')
export class WebsiteController {
    constructor(private readonly websiteService: WebsiteService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new website' })
    @ApiResponse({ status: 201, description: 'The website has been successfully created.', type: Website })
    create(@Body() createWebsiteDto: CreateWebsiteDto) {
        return this.websiteService.create(createWebsiteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all websites' })
    @ApiResponse({ status: 200, description: 'Return all websites.', type: [Website] })
    findAll() {
        return this.websiteService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a website by id' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'Return the website.', type: Website })
    @ApiResponse({ status: 404, description: 'Website not found.' })
    findOne(@Param('id') id: string) {
        return this.websiteService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a website' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'The website has been successfully updated.', type: Website })
    update(@Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
        return this.websiteService.update(id, updateWebsiteDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a website' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'The website has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.websiteService.remove(id);
    }
}
