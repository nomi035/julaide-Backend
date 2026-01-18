import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';

@Controller('websites')
export class WebsiteController {
    constructor(private readonly websiteService: WebsiteService) { }

    @Post()
    create(@Body() createWebsiteDto: CreateWebsiteDto) {
        return this.websiteService.create(createWebsiteDto);
    }

    @Get()
    findAll() {
        return this.websiteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.websiteService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
        return this.websiteService.update(id, updateWebsiteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.websiteService.remove(id);
    }
}
