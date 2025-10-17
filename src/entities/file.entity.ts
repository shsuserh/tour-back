import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';
export class File extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column()
  extension!: string;

  @Column()
  size!: number;

  @Column({ nullable: true })
  filePath!: string;
}
