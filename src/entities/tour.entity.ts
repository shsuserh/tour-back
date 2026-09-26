import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TourTranslation } from './tourTranslation.entity';
import { TourFile } from './tourFile.entity';
import { TourType } from '../datatypes/enums/enums';
import { TourItineraryStep } from '../datatypes/internal/tour.internal';

// pg returns numeric columns as strings
const numeric = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value == null ? null : Number(value)),
};

@Entity('tour')
export class Tour extends BaseEntity {
  @Column({ default: false })
  isActive!: boolean;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'enum', enum: TourType })
  type!: TourType;

  // Region key used for filtering; the display label is the translated `region` field.
  @Column()
  region!: string;

  @OneToMany(() => TourTranslation, (translation) => translation.tour, { cascade: true })
  translations!: TourTranslation[];

  @Column({ type: 'jsonb', default: [] })
  itinerary!: TourItineraryStep[];

  @Column({ type: 'int', nullable: true })
  durationHours!: number | null;

  @Column({ type: 'int', nullable: true })
  durationDays!: number | null;

  // USD per person
  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: numeric })
  price!: number;

  // USD per group, only when a private option exists
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: numeric })
  privatePrice!: number | null;

  @Column({ default: false })
  privateOnly!: boolean;

  @Column({ type: 'int' })
  maxGroup!: number;

  // Guide languages (LanguageCode values)
  @Column({ type: 'simple-array' })
  languages!: string[];

  @Column({ default: false })
  popular!: boolean;

  @OneToMany(() => TourFile, (tourFile) => tourFile.tour)
  images!: TourFile[];
}
