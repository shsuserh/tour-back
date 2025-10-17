import { Entity } from 'typeorm';
import { File } from './file.entity';

@Entity('tempFile')
export class TempFile extends File {}
