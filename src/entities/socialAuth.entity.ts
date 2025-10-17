import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { SocialProvider } from '../datatypes/enums/enums';

@Entity('social_auth')
@Index(['provider', 'providerId'], { unique: true })
export class SocialAuth extends BaseEntity {
  @Column({ type: 'enum', enum: SocialProvider, nullable: false })
  provider!: SocialProvider;

  @Column({ nullable: false })
  providerId!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ type: 'json', nullable: true })
  rawData?: Record<string, unknown>;

  @ManyToOne(() => User, (user) => user.socialAuths, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: false })
  userId!: string;
}
