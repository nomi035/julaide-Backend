import { BaseEntity } from '../../../base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Analytics } from '../../analytics/entities/analytics.entity';

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
    @Column()
    domain: string;

    @Column({
        type: 'enum',
        enum: DeploymentPlatform,
        default: DeploymentPlatform.OTHER,
    })
    deploymentPlatform: DeploymentPlatform;

    @Column({ unique: true, nullable: true })
    darkVisitorPropertyId: string;

    @Column({ default: 'pending' })
    status: 'pending' | 'active' | 'failed';

    @ManyToOne(() => User, (user) => user.websites)
    user: User;

    @OneToMany(() => Analytics, (analytics) => analytics.website)
    analytics: Analytics[];
}
