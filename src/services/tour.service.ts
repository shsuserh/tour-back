import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { TourRequestDto } from '../datatypes/dtos/request/tour.request.dto';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { AppError, ERROR_TYPES } from '../errors';

import { Tour } from '../entities/tour.entity';
import { AppDataSource } from '../config/dataSource';
import { TOUR_MESSAGES } from '../constants/tour.constants';
import { TourFile } from '../entities/tourFile.entity';
import { PaginationPayload } from '../datatypes/internal/common';
import { PAGINATION_DEFAULT_PARAMS } from '../constants/common.constants';
import tourRepository from '../repositories/tour.repository';
import fileService from './file.service';

import { removeFilesFromUploadFolder } from '../utils/removeFileFromUploadFolder';
import { TourTranslation } from '../entities/tourTranslation.entity';
import { updateTranslations } from '../utils/updateTranslation';

// List values are stored as a JSON array string in the translation `value` column.
const toTranslationRows = (translations: TourRequestDto['translations']) =>
  translations.map(({ lgCode, field, value }) => ({
    lgCode,
    field,
    value: Array.isArray(value) ? JSON.stringify(value) : value,
  }));

// Plain tour columns from the request; relations are handled separately.
const toTourColumns = (dto: TourRequestDto): Partial<Tour> => ({
  slug: dto.slug,
  type: dto.type,
  region: dto.region,
  durationHours: dto.durationHours ?? null,
  durationDays: dto.durationDays ?? null,
  price: dto.price,
  privatePrice: dto.privatePrice ?? null,
  privateOnly: dto.privateOnly ?? false,
  maxGroup: dto.maxGroup,
  languages: dto.languages,
  popular: dto.popular ?? false,
  itinerary: (dto.itinerary ?? []).map(({ time, title, text }) => ({ time, title: { ...title }, text: { ...text } })),
});

export class TourService {
  private repository: Repository<Tour> = AppDataSource.getRepository(Tour);

  private async assertSlugIsFree(slug: string, tourId?: string): Promise<void> {
    const existing = await this.repository.findOne({ where: { slug }, select: ['id'] });
    if (existing && existing.id !== tourId) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        errors: [TOUR_MESSAGES.slugTakenErrorMessage],
        toasterErrors: [TOUR_MESSAGES.slugTakenErrorMessage],
      });
    }
  }

  // Makes the tour's gallery match `imageIds` (in order). Returns file paths to delete after commit.
  private async syncTourImages(
    tour: Tour,
    imageIds: string[],
    transactionalEntityManager: EntityManager
  ): Promise<string[]> {
    const existing = tour.images ?? [];
    const existingIds = new Set(existing.map((image) => image.id));
    const removed = existing.filter((image) => !imageIds.includes(image.id));
    const newIds = imageIds.filter((id) => !existingIds.has(id));

    if (removed.length) await transactionalEntityManager.remove(removed);
    // saveModuleFiles keeps the temp file id, so new images end up with the ids from imageIds.
    if (newIds.length) await fileService.saveModuleFiles(TourFile, newIds, tour.id, transactionalEntityManager, 'tour');
    for (const [sortOrder, id] of imageIds.entries()) {
      await transactionalEntityManager.update(TourFile, id, { sortOrder });
    }

    return removed.map((image) => image.filePath);
  }

  async processTourCreation(tourRequestDto: TourRequestDto): Promise<void> {
    await this.assertSlugIsFree(tourRequestDto.slug);

    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      const tour = await tourRepository.createTour(
        {
          ...toTourColumns(tourRequestDto),
          isActive: tourRequestDto.isActive ?? false,
          translations: toTranslationRows(tourRequestDto.translations) as TourTranslation[],
        },
        transactionalEntityManager
      );

      await this.syncTourImages(tour, tourRequestDto.imageIds ?? [], transactionalEntityManager);
    });
  }

  async getTourList(paginationPayload: PaginationPayload): Promise<{ tourList: Tour[]; total: number }> {
    const { page = PAGINATION_DEFAULT_PARAMS.page, limit = PAGINATION_DEFAULT_PARAMS.limit } = paginationPayload;
    const skip = (page - PAGINATION_DEFAULT_PARAMS.page) * limit;

    return tourRepository.getTourList(limit, skip);
  }

  async getById(id: string): Promise<Tour | null> {
    return tourRepository.getById(id);
  }

  async getActiveTours(): Promise<Tour[]> {
    return tourRepository.getActiveTours();
  }

  async getActiveTourBySlug(slug: string): Promise<Tour> {
    const tour = await tourRepository.getActiveTourBySlug(slug);
    if (!tour) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [TOUR_MESSAGES.notFoundErrorMessage],
      });
    }
    return tour;
  }

  async processTourUpdate(id: string, updateTourPayload: TourRequestDto): Promise<void> {
    const existingTour = await tourRepository.getById(id);
    if (!existingTour)
      throw new AppError({ code: ERROR_TYPES.notFoundError, errors: [TOUR_MESSAGES.notFoundErrorMessage] });

    await this.assertSlugIsFree(updateTourPayload.slug, id);

    const filesToBeDeleted: string[] = [];
    const transactionManager = new TransactionManager();
    return transactionManager.runInTransaction(
      async (transactionalEntityManager: EntityManager) => {
        await updateTranslations(
          existingTour,
          Tour,
          toTranslationRows(updateTourPayload.translations),
          transactionalEntityManager,
          TourTranslation
        );

        if (updateTourPayload.imageIds) {
          filesToBeDeleted.push(
            ...(await this.syncTourImages(existingTour, updateTourPayload.imageIds, transactionalEntityManager))
          );
        }

        Object.assign(existingTour, toTourColumns(updateTourPayload));
        existingTour.isActive = updateTourPayload.isActive ?? existingTour.isActive;
        // Images were synced above; a stale array here would make TypeORM detach the new ones.
        delete (existingTour as Partial<Tour>).images;

        await tourRepository.updateTour(existingTour, transactionalEntityManager);
      },
      removeFilesFromUploadFolder,
      filesToBeDeleted
    );
  }

  async updateTourStatus(id: string, isActive: boolean): Promise<UpdateResult> {
    const tour = await this.repository.update(id, { isActive });

    if (tour && tour.affected === 0) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [TOUR_MESSAGES.notFoundUpdateErrorMessage],
      });
    }

    return tour;
  }

  async deleteTour(id: string): Promise<void> {
    const tour = await tourRepository.getById(id);
    if (!tour) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [TOUR_MESSAGES.notFoundErrorMessage],
      });
    }
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      await tourRepository.deleteTour(tour, transactionalEntityManager);
    });
  }
}
const tourService = new TourService();
export default tourService;
