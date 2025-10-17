import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/dataSource';
import { Tour } from '../entities/tour.entity';
import { TourRequestDto } from '../datatypes/dtos/request/tour.request.dto';
import { LanguageCode } from '../datatypes/enums/enums';

import { removeFilesFromUploadFolder } from '../utils/removeFileFromUploadFolder';

class TourRepository {
  private cesRepository: Repository<Tour> = AppDataSource.getRepository(Tour);

  async createTour(cesRequestDto: TourRequestDto, transactionalEntityManager?: EntityManager): Promise<Tour> {
    const tour = this.cesRepository.create(cesRequestDto);

    if (transactionalEntityManager) await transactionalEntityManager.save(tour);
    else await this.cesRepository.save(tour);

    return tour;
  }


  async getTourList(limit: number, skip: number): Promise<{ tourList: Tour[]; total: number }> {
    const query = this.cesRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.translations', 'translations')
      .where('translations.lgCode = :languageCode', { languageCode: LanguageCode.AM });

    const [tourList, total] = await query.orderBy('tour.created', 'DESC').skip(skip).take(limit).getManyAndCount();

    return { tourList, total };
  }

  async getById(id: string): Promise<Tour | null> {
    return await this.cesRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.translations', 'translations')
      .leftJoinAndSelect('tour.image', 'image')
      .where('tour.id = :id', { id })
      .getOne();
  }


  async updateTour(id: string, updateCesPayload: Tour, transactionalEntityManager?: EntityManager): Promise<Tour> {
    if (transactionalEntityManager) {
      return await transactionalEntityManager.save(updateCesPayload);
    } else {
      return await this.cesRepository.save(updateCesPayload);
    }
  }













  async deleteTour(tour, transactionalEntityManager: EntityManager): Promise<void> {
    const fileNames: string[] = [];

    if (tour.image && tour.image.name) {
      fileNames.push(tour.image.filePath);
    }



    await transactionalEntityManager.remove(tour);

    if (fileNames.length > 0) {
      await removeFilesFromUploadFolder(fileNames);
    }
  }

  async getTourInfo(id: string, lgCode: string): Promise<Tour | null> {
    return (
      this.cesRepository
        .createQueryBuilder('tour')
        .leftJoinAndSelect('tour.translations', 'translations')
        .leftJoinAndSelect('tour.image', 'image')
        .where('tour.id = :id', { id })
        .andWhere('translations.lgCode = :languageCode', { languageCode: lgCode })
        .getOne()
    );
  }


}

const tourRepository = new TourRepository();
export default tourRepository;
