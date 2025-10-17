import { EntityTarget, ObjectLiteral } from 'typeorm';
import { EntityManager } from 'typeorm';
import { TempFile } from '../entities/tempFile.entity';
import tempFileRepository from '../repositories/tempFile.repository';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { AppDataSource } from '../config/dataSource';
import { VALIDATION_ERROR_MESSAGES } from '../constants/common.constants';
import { AppError } from '../errors';
import path from 'path';

class FileService {
  async uploadTempFiles(
    files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }
  ): Promise<TempFile[]> {
    const filesArray = Array.isArray(files) ? files : files['fieldname'];

    const generatedFiles = filesArray.map((fileData) => this.generateTempFile(fileData));
    const newFiles: TempFile[] = [];
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      for (const file of generatedFiles) {
        const newFile = await tempFileRepository.createTempFile(file, transactionalEntityManager);
        newFiles.push(newFile);
      }
    });

    return newFiles;
  }

  generateTempFile(fileData: Express.Multer.File): TempFile {
    const file = new TempFile();
    const extension = path.extname(fileData.originalname).slice(1);
    const parsed = path.parse(fileData.filename);
    const name = `${parsed.name}.${extension}`;

    file.name = name;
    file.originalName = fileData.originalname;
    file.mimeType = fileData.mimetype;
    file.extension = extension;
    file.size = fileData.size;
    file.filePath = path.join(process.cwd(), fileData.destination, name);
    return file;
  }

  async saveModuleFiles<T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    fileIds: string[],
    relationEntityId: string,
    transactionalEntityManager: EntityManager,
    relationEntityFieldName: string = 'entity'
  ): Promise<ObjectLiteral[]> {
    const entityFileRepository = AppDataSource.getRepository(entity);
    const filesArr: ObjectLiteral[] = [];
    for (const id of fileIds) {
      const tempFile = await tempFileRepository.getById(id);

      if (!tempFile) {
        throw new AppError({ code: 404, errors: [VALIDATION_ERROR_MESSAGES.validateFileExistence] });
      }

      if (tempFile) {
        const fileData = {
          ...tempFile,
          [relationEntityFieldName]: relationEntityId,
        };

        const entityFile = entityFileRepository.create(fileData);
        const newFile = await transactionalEntityManager.save(entity, entityFile);

        await transactionalEntityManager.delete(TempFile, fileIds);
        filesArr.push(newFile);
      }
    }

    return filesArr;
  }

  async removeModuleFileRelation<T extends ObjectLiteral>(
    entity: T,
    fileRelationKey: string,
    transactionalEntityManager: EntityManager
  ) {
    await transactionalEntityManager.remove(entity[fileRelationKey]);
  }

  async updateModuleFileRelation<T extends EntityTarget<ObjectLiteral>>(
    entityObject: ObjectLiteral,
    fileRelationKey: string,
    entity: T,
    fileIds: string[],
    relationEntityId: string,
    transactionalEntityManager: EntityManager,
    entityId: string
  ) {
    await this.removeModuleFileRelation(entityObject, fileRelationKey, transactionalEntityManager);
    return this.saveModuleFiles(entity, fileIds, relationEntityId, transactionalEntityManager, entityId);
  }
}

const fileService = new FileService();
export default fileService;
