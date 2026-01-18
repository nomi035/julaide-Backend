import { BaseEntity } from 'base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Website } from '../../website/entities/website.entity';

@Entity('User')
export class User extends BaseEntity {
  @Column()
  name: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  role: Role;us

  @OneToMany(() => Website, (website) => website.user)
  websites: Website[];
}

export enum Role {
  TEACHER = 'teacher',
  ADMIN = 'admin',
  STUDENT = 'student',
}
