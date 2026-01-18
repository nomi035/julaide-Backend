import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { CreateAnalyticsDto, UpdateAnalyticsDto } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Analytics)
        private analyticsRepository: Repository<Analytics>,
    ) { }

    async create(createAnalyticsDto: CreateAnalyticsDto): Promise<Analytics> {
        const analytics = this.analyticsRepository.create({
            ...createAnalyticsDto,
            website: { id: createAnalyticsDto.websiteId } as any,
        });
        return await this.analyticsRepository.save(analytics);
    }

    async findAll(): Promise<Analytics[]> {
        return await this.analyticsRepository.find({ relations: ['website'] });
    }

    async findOne(id: string): Promise<Analytics> {
        const analytics = await this.analyticsRepository.findOne({
            where: { id },
            relations: ['website'],
        });
        if (!analytics) {
            throw new NotFoundException(`Analytics record with ID ${id} not found`);
        }
        return analytics;
    }

    async update(id: string, updateAnalyticsDto: UpdateAnalyticsDto): Promise<Analytics> {
        const analytics = await this.findOne(id);
        Object.assign(analytics, updateAnalyticsDto);
        return await this.analyticsRepository.save(analytics);
    }

    async remove(id: string): Promise<void> {
        const analytics = await this.findOne(id);
        await this.analyticsRepository.remove(analytics);
    }
}
