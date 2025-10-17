import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class TranslationEntity extends BaseEntity {
  @Column()
  lgCode!: string;

  @Column()
  field!: string;

  @Column()
  value!: string;
}
