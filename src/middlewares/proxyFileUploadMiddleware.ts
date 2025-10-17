import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';
import { FILE_MAX_SIZE } from '../constants/common.constants';
import { AppError, ERROR_TYPES } from '../errors';

const createProxyFileUploadMiddleware = (allowedMimeTypes: string[], fileTypesForMessage: string): Multer => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: FILE_MAX_SIZE },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new AppError({
            code: ERROR_TYPES.badRequestError,
            errors: [`${fileTypesForMessage}`],
          })
        );
      }

      return cb(null, true);
    },
  });
};

export default createProxyFileUploadMiddleware;
