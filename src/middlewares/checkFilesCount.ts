import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';
import { VALIDATION_ERROR_MESSAGES } from '../constants/common.constants';

const checkFilesCount = async (_req: Request, res: Response, _next: NextFunction) => {
  const { files } = _req;

  if (!files || !files.length) {
    throw new AppError({ code: 400, errors: [VALIDATION_ERROR_MESSAGES.validateFileType] });
  }

  _next();
};

export default checkFilesCount;
