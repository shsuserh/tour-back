import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import { AppError, ERROR_TYPES } from '../errors';
import multer from 'multer';
import { MULTER_FILE_LIMIT_ERROR_CODE, VALIDATION_ERROR_MESSAGES } from '../constants/common.constants';

const errorHandler = async (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  const success = false;
  let errors: object | undefined;
  let toaster: boolean | undefined;
  let toasterErrors: string[] | undefined;
  console.error('Error====>', error);

  if (error instanceof AppError) {
    statusCode = error.code;
    toaster = error.toaster;
    errors = error.errors;
    toasterErrors = error.toasterErrors;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === MULTER_FILE_LIMIT_ERROR_CODE) {
      statusCode = ERROR_TYPES.badRequestError;
      toaster = true;
      toasterErrors = [VALIDATION_ERROR_MESSAGES.validateFileSize];
    }
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === ERROR_TYPES.badRequestError) {
      statusCode = ERROR_TYPES.badRequestError;
      toaster = false;
      errors = [error.response?.data.error];
    }
  }

  res.status(statusCode).send({ success, toaster, errors, toasterErrors });
};

export default errorHandler;
