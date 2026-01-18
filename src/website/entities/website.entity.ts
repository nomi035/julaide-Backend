import { BaseEntity } from '../../../base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Analytics } from '../../analytics/entities/analytics.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum DeploymentPlatform {
    VERCEL = 'vercel',
    NETLIFY = 'netlify',
    AWS = 'aws',
    DIGITAL_OCEAN = 'digital_ocean',
    HEROKU = 'heroku',
    CLOUDFLARE = 'cloudflare',
    SELF_HOSTED = 'self_hosted',
    OTHER = 'other',
}

@Entity('websites')
export class Website extends BaseEntity {
    @ApiProperty({ example: 'example.com', description: 'The domain of the website' })
    @Column()
    domain: string;

    @ApiProperty({ enum: DeploymentPlatform, default: DeploymentPlatform.OTHER })
    @Column({
        type: 'enum',
        enum: DeploymentPlatform,
        default: DeploymentPlatform.OTHER,
    })
    deploymentPlatform: DeploymentPlatform;

    @ApiProperty({ example: 'prop_123', description: 'Dark Visitor Property ID', required: false })
    @Column({ unique: true, nullable: true })
    darkVisitorPropertyId: string;

    @ApiProperty({ example: 'pending', enum: ['pending', 'active', 'failed'] })
    @Column({ default: 'pending' })
    status: 'pending' | 'active' | 'failed';

    @ManyToOne(() => User, (user) => user.websites)
    user: User;

    @OneToMany(() => Analytics, (analytics) => analytics.website)
    analytics: Analytics[];
}
