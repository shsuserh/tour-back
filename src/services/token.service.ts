import { EntityManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import tokenRepository from '../repositories/token.repository';
import { AppError, ERROR_TYPES } from '../errors';
import { Token } from '../entities/token.entity';
import { TOKEN_COUNT_PER_USER_PER_SESSION } from '../constants/token.constants';
import { TokenPayload } from '../datatypes/internal/token.internal';
import { TokenType } from '../datatypes/enums/enums';
import { env } from '../config/env';

class TokenService {
  async storeToken(tokenPayload: TokenPayload, transactionalEntityManager?: EntityManager): Promise<void> {
    await tokenRepository.createToken(tokenPayload, transactionalEntityManager);
  }

  async validateRefreshToken(payload: string): Promise<void> {
    const refreshToken = await tokenRepository.getActiveTokenByPayload(payload);
    if (!refreshToken) {
      throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    }

    if (refreshToken.type !== TokenType.refreshToken) {
      await this.revokeToken(refreshToken);
      throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    }

    const jwtRefreshKey = env.JWT_REFRESH_TOKEN_KEY;
    try {
      jwt.verify(payload, jwtRefreshKey);
    } catch (err) {
      await this.revokeToken(refreshToken);
      throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    }
  }

  async revokeToken(token: Token, transactionalEntityManager?: EntityManager): Promise<void> {
    await tokenRepository.revokeToken(token, transactionalEntityManager);
  }

  async revokeTokensBySessionAndUserId(session: string, userId: string): Promise<void> {
    const tokens = await tokenRepository.getActiveTokensBySessionAndUserId(session, userId);
    if (!tokens.length) {
      throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    }
    if (tokens.length !== TOKEN_COUNT_PER_USER_PER_SESSION) {
      throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    }

    await Promise.all(tokens.map(async (token) => await this.revokeToken(token)));
  }
}

const tokenService = new TokenService();
export default tokenService;
