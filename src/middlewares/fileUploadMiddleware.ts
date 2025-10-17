import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';
import { FILE_MAX_SIZE, VALIDATION_ERROR_MESSAGES } from '../constants/common.constants';
import { AppError, ERROR_TYPES } from '../errors';

const createFileUploadMiddleware = (
  allowedMimeTypes: string[],
  fileTypesForMessage: string,
  storage: multer.StorageEngine
): Multer => {
  return multer({
    storage,
    limits: { fileSize: FILE_MAX_SIZE },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new AppError({
            code: ERROR_TYPES.badRequestError,
            errors: [`${VALIDATION_ERROR_MESSAGES.validateFileType} ${fileTypesForMessage}`],
          })
        );
      }

      return cb(null, true);
    },
  });
};

export default createFileUploadMiddleware;
