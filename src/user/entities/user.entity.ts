import { BaseEntity } from 'base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Website } from '../../website/entities/website.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  CLIENT = 'client',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('User')
export class User extends BaseEntity {
  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @Column()
  phone: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ enum: Role, default: Role.CLIENT })
  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  // For team members: points to their client's user ID
  @ApiPropertyOptional({ example: 'uuid-of-client', description: 'Client ID for team members' })
  @Column({ nullable: true })
  clientId: string;

  // Self-referencing relationship: team member belongs to a client
  @ManyToOne(() => User, (user) => user.teamMembers, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: User;

  // For clients: their team members
  @OneToMany(() => User, (user) => user.client)
  teamMembers: User[];

  @OneToMany(() => Website, (website) => website.user)
  websites: Website[];
}
