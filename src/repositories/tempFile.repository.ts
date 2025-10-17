import { EntityManager, In, Repository } from 'typeorm';
import { AppDataSource } from '../config/dataSource';
import { TempFile } from '../entities/tempFile.entity';

class TempFileRepository {
  private readonly repository: Repository<TempFile> = AppDataSource.getRepository(TempFile);

  async createTempFile(file: TempFile, transactionalEntityManager?: EntityManager): Promise<TempFile> {
    if (transactionalEntityManager) return transactionalEntityManager.save(file);
    return this.repository.save(file);
  }

  async getFilesByDate(date: Date, numberOfDays: number): Promise<TempFile[]> {
    return this.repository
      .createQueryBuilder('tempFile')
      .where('tempFile.created <= :date', { date: new Date(date.setDate(date.getDate() - numberOfDays)) })
      .getMany();
  }

  async getByFileName(fileName: string): Promise<TempFile | null> {
    return this.repository.findOne({ where: { name: fileName } });
  }

  async deleteTempFilesByNames(names: string[]): Promise<void> {
    await this.repository.delete({ name: In(names) });
  }

  async getById(id: string): Promise<TempFile | null> {
    return this.repository.findOne({ where: { id } });
  }
}

const tempFileRepository = new TempFileRepository();
export default tempFileRepository;
