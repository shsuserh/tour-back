import { NextFunction, Response } from 'express';
import { AppError, ERROR_TYPES } from '../errors';
import { RequestWithUser } from '../datatypes/internal/common';
import userRepository from '../repositories/user.repository';
import { UserRole } from '../datatypes/enums/enums';
import { AUTH_ERROR_MESSAGES } from '../constants/auth.constants';

const requireToBeSuperAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = await userRepository.getUserById(req.user.id);
  if (!user) {
    throw new AppError({ code: ERROR_TYPES.unauthorizedError });
  }
  if (user.role !== UserRole.superAdmin) {
    throw new AppError({
      code: ERROR_TYPES.forbiddenError,
      toaster: true,
      toasterErrors: [AUTH_ERROR_MESSAGES.noAccessErrorMessage],
    });
  }
  next();
};

export default requireToBeSuperAdmin;
