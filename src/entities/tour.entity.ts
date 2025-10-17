import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TourTranslation } from './tourTranslation.entity';
import { TourFile } from './tourFile.entity';
import { TourDurationType } from '../datatypes/enums/enums';
@Entity('tour')
export class Tour extends BaseEntity {
  @Column({ default: false })
  isActive!: boolean;

  @OneToMany(() => TourTranslation, (translation) => translation.tour, { cascade: true })
  translations!: TourTranslation[];

  @Column({ type: 'enum', enum: TourDurationType, default: TourDurationType.hour })
  durationType!: TourDurationType;

  @Column({ type: 'int', nullable: false })
  durationValue!: number;

  @Column({ type: 'int', nullable: false })
  minMember!: number;

  @Column({ type: 'int', nullable: false })
  maxMember!: number;

  @Column({ type: 'text', nullable: false })
  pickUpLocation!: string;

  @Column({ type: 'text', nullable: false })
  dropOffLocation!: string;

  @Column({ type: 'float', nullable: false })
  price!: number;

  @Column({ default: false })
  adultsOnly!: boolean;

  @OneToOne(() => TourFile, (tourFile) => tourFile.tour, { cascade: true, onDelete: 'CASCADE' })
  image!: TourFile;

}
