import { BaseEntity } from '../../../base.entity';
import { Column, Entity, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { Website } from '../../website/entities/website.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('analytics')
export class Analytics extends BaseEntity {
    @ApiProperty({ example: 'website-uuid-here', description: 'The ID of the website this data belongs to' })
    @Index()
    @Column()
    websiteId: string;

    @ApiProperty({ example: 100, description: 'Total number of visitors' })
    @Column({ type: 'int', default: 0 })
    totalVisitors: number;

    @ApiProperty({ example: 10, description: 'Number of bot visitors' })
    @Column({ type: 'int', default: 0 })
    botTrafficCount: number;

    @ApiProperty({ example: { 'AI Crawler': 5, 'Search Engine': 5 }, description: 'Breakdown of bot types' })
    @Column({ type: 'jsonb', nullable: true })
    botTypeBreakdown: any;

    @ApiProperty({ description: 'The time this data point represents' })
    @CreateDateColumn()
    recordedAt: Date;

    @ManyToOne(() => Website, (website) => website.analytics)
    website: Website;
}
