import { BaseEntity } from '../../../base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Analytics } from '../../analytics/entities/analytics.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum IntegrationPlatform {
    WORDPRESS = 'WordPress',
    CLOUDFLARE = 'Cloudflare',
    SHOPIFY = 'Shopify',
    AWS = 'AWS',
}

export enum IntegrationType {
    BACKEND = 'Backend',
    FRONTEND = 'Frontend',
}

export enum BackendOption {
    NODEJS = 'Node.js',
    PYTHON = 'Python',
    PHP = 'PHP',
    REST_API = 'REST API',
}

export enum IntegrationMethod {
    SELF = 'Self',
    SUPPORT = 'Support',
}

@Entity('websites')
export class Website extends BaseEntity {
    @ApiProperty({ example: 'My Website', description: 'The name of the website' })
    @Column()
    name: string;

    @ApiProperty({ example: 'example.com', description: 'The domain of the website' })
    @Column()
    domain: string;

    @ApiProperty({ enum: IntegrationPlatform })
    @Column({
        type: 'enum',
        enum: IntegrationPlatform,
    })
    integrationPlatform: IntegrationPlatform;

    @ApiProperty({ enum: IntegrationType })
    @Column({
        type: 'enum',
        enum: IntegrationType,
    })
    integrationType: IntegrationType;

    @ApiPropertyOptional({ enum: BackendOption })
    @Column({
        type: 'enum',
        enum: BackendOption,
        nullable: true,
    })
    backendOption: BackendOption;

    @ApiPropertyOptional({ example: 'JavaScript tag' })
    @Column({ nullable: true })
    frontendOption: string;

    @ApiProperty({ enum: IntegrationMethod, default: IntegrationMethod.SELF })
    @Column({
        type: 'enum',
        enum: IntegrationMethod,
        default: IntegrationMethod.SELF,
    })
    website_integration_method: IntegrationMethod;

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
