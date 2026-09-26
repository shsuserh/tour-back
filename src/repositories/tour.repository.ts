import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/dataSource';
import { Tour } from '../entities/tour.entity';
import { LanguageCode } from '../datatypes/enums/enums';

import { removeFilesFromUploadFolder } from '../utils/removeFileFromUploadFolder';

class TourRepository {
  private tourRepository: Repository<Tour> = AppDataSource.getRepository(Tour);

  async createTour(tourPayload: Partial<Tour>, transactionalEntityManager?: EntityManager): Promise<Tour> {
    const tour = this.tourRepository.create(tourPayload);

    if (transactionalEntityManager) await transactionalEntityManager.save(tour);
    else await this.tourRepository.save(tour);

    return tour;
  }

  async getTourList(limit: number, skip: number): Promise<{ tourList: Tour[]; total: number }> {
    const query = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.translations', 'translations')
      .where('translations.lgCode = :languageCode', { languageCode: LanguageCode.AM });

    const [tourList, total] = await query.orderBy('tour.created', 'DESC').skip(skip).take(limit).getManyAndCount();

    return { tourList, total };
  }

  async getById(id: string): Promise<Tour | null> {
    return await this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.translations', 'translations')
      .leftJoinAndSelect('tour.images', 'images')
      .where('tour.id = :id', { id })
      .getOne();
  }

  async getActiveTours(): Promise<Tour[]> {
    return (
      this.tourRepository
        .createQueryBuilder('tour')
        .leftJoinAndSelect('tour.translations', 'translations')
        .leftJoinAndSelect('tour.images', 'images')
        .where('tour.isActive = true')
        // ponytail: creation order is the site's display order; add a sortOrder column if admins need to reorder
        .orderBy('tour.created', 'ASC')
        .getMany()
    );
  }

  async getActiveTourBySlug(slug: string): Promise<Tour | null> {
    return this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.translations', 'translations')
      .leftJoinAndSelect('tour.images', 'images')
      .where('tour.slug = :slug', { slug })
      .andWhere('tour.isActive = true')
      .getOne();
  }

  async updateTour(updateTourPayload: Tour, transactionalEntityManager?: EntityManager): Promise<Tour> {
    if (transactionalEntityManager) {
      return await transactionalEntityManager.save(updateTourPayload);
    } else {
      return await this.tourRepository.save(updateTourPayload);
    }
  }

  async deleteTour(tour: Tour, transactionalEntityManager: EntityManager): Promise<void> {
    const images = tour.images ?? [];
    const fileNames = images.map((image) => image.filePath);

    await transactionalEntityManager.remove(images);
    await transactionalEntityManager.remove(tour);

    if (fileNames.length > 0) {
      await removeFilesFromUploadFolder(fileNames);
    }
  }
}

const tourRepository = new TourRepository();
export default tourRepository;
