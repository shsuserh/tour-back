import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { File } from './file.entity';
import { Tour } from './tour.entity';

@Entity('tourFile')
export class TourFile extends File {
  @OneToOne(() => Tour, (tour) => tour.image, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  tour?: Tour;

}
