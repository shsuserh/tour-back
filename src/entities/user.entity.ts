import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Token } from './token.entity';
import { SocialAuth } from './socialAuth.entity';
import { UserRole } from '../datatypes/enums/enums';

@Entity('user')
export class User extends BaseEntity {
  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: true })
  hashedPassword?: string;

  @Column({ nullable: true })
  salt?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  status?: number;

  @Column({ nullable: true })
  gender?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'enum', enum: UserRole, nullable: false, default: UserRole.user })
  role!: UserRole;

  @OneToMany(() => Token, (token) => token.user)
  tokens!: Token[];

  @OneToMany(() => SocialAuth, (socialAuth) => socialAuth.user)
  socialAuths!: SocialAuth[];
}
