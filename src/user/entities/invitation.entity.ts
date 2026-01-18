import { BaseEntity } from 'base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    EXPIRED = 'expired',
}

@Entity('invitations')
export class Invitation extends BaseEntity {
    @ApiProperty({ example: 'john@example.com', description: 'Email of the invited team member' })
    @Column()
    email: string;

    @ApiProperty({ example: 'abc123token', description: 'Unique invitation token' })
    @Column({ unique: true })
    token: string;

    @ApiProperty({ example: 'uuid-of-client', description: 'The client who sent the invitation' })
    @Column()
    clientId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'clientId' })
    client: User;

    @ApiProperty({ description: 'Invitation expiration date' })
    @Column({ type: 'timestamptz' })
    expiresAt: Date;

    @ApiProperty({ enum: InvitationStatus, default: InvitationStatus.PENDING })
    @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.PENDING })
    status: InvitationStatus;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Pre-filled name for the invitee' })
    @Column({ nullable: true })
    name: string;
}
