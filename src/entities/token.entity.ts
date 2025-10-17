import { Entity, Column, Unique, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { TokenType } from '../datatypes/enums/enums';

@Entity('token')
@Unique(['payload', 'session', 'type'])
export class Token extends BaseEntity {
  @Column({ nullable: false })
  payload!: string;

  @Column({ nullable: false })
  session!: string;

  @Column({ type: 'enum', enum: TokenType, nullable: false })
  type!: TokenType;

  @Column({ nullable: false, default: false })
  revoked!: boolean;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user!: User;
}
