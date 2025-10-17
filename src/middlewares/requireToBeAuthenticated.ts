import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, ERROR_TYPES } from '../errors';
import { env } from '../config/env';
import { AUTH_TOKEN_PREFIX } from '../constants/common.constants';
import { RequestWithUser } from '../datatypes/internal/common';
import tokenRepository from '../repositories/token.repository';
import tokenService from '../services/token.service';
import { TokenType } from '../datatypes/enums/enums';
import { AUTH_ERROR_MESSAGES } from '../constants/auth.constants';

const requireToBeAuthenticated = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  let token;
  const jwtKey = env.JWT_ACCESS_TOKEN_KEY;

  if (authorization && authorization.startsWith(AUTH_TOKEN_PREFIX)) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    throw new AppError({
      code: ERROR_TYPES.unauthorizedError,
      toaster: false,
      errors: [AUTH_ERROR_MESSAGES.unauthorizedRequestErrorMessage],
    });
  }

  const accessToken = await tokenRepository.getActiveTokenByPayload(token);
  if (!accessToken) {
    throw new AppError({
      code: ERROR_TYPES.unauthorizedError,
      toaster: false,
      errors: [AUTH_ERROR_MESSAGES.unauthorizedRequestErrorMessage],
    });
  }

  if (accessToken.type !== TokenType.accessToken) {
    await tokenService.revokeToken(accessToken);
    throw new AppError({
      code: ERROR_TYPES.unauthorizedError,
      toaster: false,
      errors: [AUTH_ERROR_MESSAGES.unauthorizedRequestErrorMessage],
    });
  }

  try {
    const decoded = jwt.verify(token, jwtKey);

    const decodedData = JSON.stringify(decoded);
    req.user = {
      id: JSON.parse(decodedData).id,
    };
    next();
  } catch (err) {
    await tokenService.revokeToken(accessToken);
    throw new AppError({
      code: ERROR_TYPES.unauthorizedError,
      toaster: false,
      errors: [AUTH_ERROR_MESSAGES.unauthorizedRequestErrorMessage],
    });
  }
};

export default requireToBeAuthenticated;
