import { BaseEntity } from '../../../base.entity';
import { Column, Entity, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { Website } from '../../website/entities/website.entity';

@Entity('analytics')
export class Analytics extends BaseEntity {
    @Index()
    @Column()
    websiteId: string;

    @Column({ type: 'int', default: 0 })
    totalVisitors: number;

    @Column({ type: 'int', default: 0 })
    botTrafficCount: number;

    @Column({ type: 'jsonb', nullable: true })
    botTypeBreakdown: any; 

    @CreateDateColumn()
    recordedAt: Date;

    @ManyToOne(() => Website, (website) => website.analytics)
    website: Website;
}
