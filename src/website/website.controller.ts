import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Website } from './entities/website.entity';
import { JwtAuthGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/entities/user.entity';

@ApiTags('Websites')
@Controller('websites')
export class WebsiteController {
    constructor(private readonly websiteService: WebsiteService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CLIENT)
    @Post()
    @ApiOperation({ summary: 'Create a new website (Client only)' })
    @ApiResponse({ status: 201, description: 'The website has been successfully created.', type: Website })
    create(@Request() req, @Body() createWebsiteDto: CreateWebsiteDto) {
        // Automatically link to the logged in client
        createWebsiteDto.userId = req.user.userId;
        return this.websiteService.create(createWebsiteDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all websites' })
    @ApiResponse({ status: 200, description: 'Return all websites.', type: [Website] })
    findAll() {
        return this.websiteService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('client/:userId')
    @ApiOperation({ summary: 'Get websites by client ID (Admin only)' })
    @ApiParam({ name: 'userId', description: 'User/Client ID' })
    @ApiResponse({ status: 200, description: 'Return websites for specific client.', type: [Website] })
    findByUser(@Param('userId') userId: string) {
        return this.websiteService.findByUser(userId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get a website by id' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'Return the website.', type: Website })
    @ApiResponse({ status: 404, description: 'Website not found.' })
    findOne(@Param('id') id: string) {
        return this.websiteService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a website' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'The website has been successfully updated.', type: Website })
    update(@Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
        return this.websiteService.update(id, updateWebsiteDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a website' })
    @ApiParam({ name: 'id', description: 'Website ID' })
    @ApiResponse({ status: 200, description: 'The website has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.websiteService.remove(id);
    }
}
