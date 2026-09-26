import { Column, Entity, ManyToOne } from 'typeorm';
import { File } from './file.entity';
import { Tour } from './tour.entity';

@Entity('tourFile')
export class TourFile extends File {
  @ManyToOne(() => Tour, (tour) => tour.images, { nullable: true, onDelete: 'CASCADE' })
  tour?: Tour;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
