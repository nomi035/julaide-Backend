import { BaseEntity } from 'base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Website } from '../../website/entities/website.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  TEACHER = 'teacher',
  ADMIN = 'admin',
  STUDENT = 'student',
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
  @Column()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @Column()
  phone: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ enum: Role, required: false })
  @Column({ nullable: true })
  role: Role;

  @OneToMany(() => Website, (website) => website.user)
  websites: Website[];
}
