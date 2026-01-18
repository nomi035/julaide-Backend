import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Website } from './entities/website.entity';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';

@Injectable()
export class WebsiteService {
    constructor(
        @InjectRepository(Website)
        private websiteRepository: Repository<Website>,
    ) { }

    async create(createWebsiteDto: CreateWebsiteDto): Promise<Website> {
        const website = this.websiteRepository.create({
            ...createWebsiteDto,
            user: { id: createWebsiteDto.userId } as any,
        });
        return await this.websiteRepository.save(website);
    }

    async findAll(): Promise<Website[]> {
        return await this.websiteRepository.find({ relations: ['user', 'analytics'] });
    }

    async findOne(id: string): Promise<Website> {
        const website = await this.websiteRepository.findOne({
            where: { id },
            relations: ['user', 'analytics'],
        });
        if (!website) {
            throw new NotFoundException(`Website with ID ${id} not found`);
        }
        return website;
    }

    async update(id: string, updateWebsiteDto: UpdateWebsiteDto): Promise<Website> {
        const website = await this.findOne(id);
        Object.assign(website, updateWebsiteDto);
        return await this.websiteRepository.save(website);
    }

    async findByUser(userId: string): Promise<Website[]> {
        return await this.websiteRepository.find({
            where: { user: { id: userId } },
            relations: ['analytics'],
        });
    }

    async remove(id: string): Promise<void> {
        const website = await this.findOne(id);
        await this.websiteRepository.remove(website);
    }
}

