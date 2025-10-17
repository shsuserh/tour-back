import { EntityManager, Repository, UpdateResult } from 'typeorm';

import { TourRequestDto } from '../datatypes/dtos/request/tour.request.dto';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { AppError, ERROR_TYPES } from '../errors';

import { Tour } from '../entities/tour.entity';
import { AppDataSource } from '../config/dataSource';
import { CES_MESSAGES } from '../constants/tour.constants';
import { TourFile } from '../entities/tourFile.entity';
import { PaginationPayload } from '../datatypes/internal/common';
import { PAGINATION_DEFAULT_PARAMS } from '../constants/common.constants';
import tourRepository from '../repositories/tour.repository';
import fileService from './file.service';

import { removeFilesFromUploadFolder } from '../utils/removeFileFromUploadFolder';
import { TourTranslation } from '../entities/tourTranslation.entity';
import { updateTranslations } from '../utils/updateTranslation';

export class TourService {
  private repository: Repository<Tour> = AppDataSource.getRepository(Tour);

  private async getEntityOrThrow(repository, entityId: string, errorMessage: string) {
    const entity = await repository.getById(entityId);
    if (!entity) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [errorMessage],
      });
    }
    return entity;
  }

  private async updateCesImageRelation(
    existingCes: Tour,
    imageId: string | null | undefined,
    transactionalEntityManager: EntityManager
  ) {
    let fileNameTobeRemove = '';
    if (existingCes.image && existingCes.image.id === imageId) {
      return;
    }
    if (!imageId && existingCes.image) {
      fileNameTobeRemove = existingCes.image.filePath;
      existingCes.image = (await fileService.removeModuleFileRelation(
        existingCes,
        'image',
        transactionalEntityManager
      )) as unknown as TourFile;
      return fileNameTobeRemove;
    }
    if (!existingCes.image && imageId) {
      existingCes.image = (await fileService.saveModuleFiles(
        TourFile,
        [imageId],
        existingCes.id,
        transactionalEntityManager,
        'tour'
      )) as unknown as TourFile;
    }
    if (existingCes.image && existingCes.image.id !== imageId) {
      fileNameTobeRemove = existingCes.image.filePath;
      existingCes.image = (await fileService.updateModuleFileRelation(
        existingCes,
        'image',
        TourFile,
        [imageId!],
        existingCes.id,
        transactionalEntityManager,
        'tour'
      )) as unknown as TourFile;
      return fileNameTobeRemove;
    }
  }

  private async findEntityById<T>(
    repository: { getById: (id: string) => Promise<T | null> },
    id: string,
    errorMessage: string
  ): Promise<T> {
    const entity = await repository.getById(id);
    if (!entity) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [errorMessage],
      });
    }
    return entity;
  }

  async processCesCreation(tourRequestDto: TourRequestDto): Promise<void> {
    const { imageId } = tourRequestDto;

    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      const tour = await tourRepository.createTour(tourRequestDto, transactionalEntityManager);

      if (imageId) {
        await fileService.saveModuleFiles(TourFile, [imageId], tour.id, transactionalEntityManager, 'tour');
      }
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

  async processTourUpdate(id: string, updateTourPayload: TourRequestDto): Promise<void> {
    const existingTour = await tourRepository.getById(id);
    if (!existingTour)
      throw new AppError({ code: ERROR_TYPES.notFoundError, errors: [CES_MESSAGES.notFoundErrorMessage] });

    const { isActive, translations, imageId } = updateTourPayload;

    const filesToBeDeleted: string[] = [];
    const transactionManager = new TransactionManager();
    return transactionManager.runInTransaction(
      async (transactionalEntityManager: EntityManager) => {
        await updateTranslations(existingTour, Tour, translations, transactionalEntityManager, TourTranslation);

        const removeImage = await this.updateCesImageRelation(existingTour, imageId, transactionalEntityManager);

        if (removeImage) {
          filesToBeDeleted.push(removeImage);
        }

        existingTour.isActive = isActive ?? existingTour.isActive;

        await tourRepository.updateTour(id, existingTour, transactionalEntityManager);
      },
      removeFilesFromUploadFolder,
      filesToBeDeleted
    );
  }

  async updateCesStatus(id: string, isActive: boolean): Promise<UpdateResult> {
    const tour = await this.repository.update(id, { isActive });

    if (tour && tour.affected === 0) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [CES_MESSAGES.notFoundUpdateErrorMessage],
      });
    }

    return tour;
  }

  async deleteCes(id: string): Promise<void> {
    const tour = await tourRepository.getById(id);
    if (!tour) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [CES_MESSAGES.notFoundErrorMessage],
      });
    }
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      await tourRepository.deleteTour(tour, transactionalEntityManager);
    });
  }

  async getTourInfo(id: string, lgCode: string): Promise<{ tour: Tour | null }> {
    const tour = await tourRepository.getById(id);

    if (!tour) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [CES_MESSAGES.notFoundErrorMessage],
      });
    }

    if (!tour.isActive) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [CES_MESSAGES.notFoundErrorMessage],
      });
    }

    const tourInfo = await tourRepository.getTourInfo(id, lgCode);

    return { tour: tourInfo };
  }

  async getCesParentPath(id: string): Promise<{ tour: Tour }> {
    const tour = await tourRepository.getById(id);
    if (!tour) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [CES_MESSAGES.notFoundErrorMessage],
      });
    }
    return { tour };
  }
}
const tourService = new TourService();
export default tourService;
