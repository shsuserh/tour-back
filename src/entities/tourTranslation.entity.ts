import { Entity, ManyToOne } from 'typeorm';
import { TranslationEntity } from './translation.entity';
import { Tour } from './tour.entity';
@Entity('tourTranslation')
export class TourTranslation extends TranslationEntity {
  @ManyToOne(() => Tour, (tour) => tour.translations, { nullable: false, onDelete: 'CASCADE' })
  tour!: string;
}
