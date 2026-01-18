import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Website])],
    controllers: [WebsiteController],
    providers: [WebsiteService],
    exports: [WebsiteService],
})
export class WebsiteModule { }
