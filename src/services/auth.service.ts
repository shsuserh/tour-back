import userRepository from '../repositories/user.repository';
import { AppError, ERROR_TYPES } from '../errors';
import jwt from 'jsonwebtoken';
import { TokenResponse } from '../datatypes/internal/token.internal';
import tokenService from './token.service';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { EntityManager } from 'typeorm';
import tokenRepository from '../repositories/token.repository';
import { TokenType } from '../datatypes/enums/enums';

import { LoginRequestDto } from '../datatypes/dtos/request/auth.request.dto';
import crypto from 'crypto';
import { env } from '../config/env';

class AuthServive {
  async verifyPassword(inputPassword, storedSaltHex, storedHashedPasswordHex) {
    return new Promise((resolve, reject) => {
      const salt = Buffer.from(storedSaltHex, 'hex');

      crypto.pbkdf2(inputPassword, salt, 310000, 32, 'sha256', (err, derivedKey) => {
        if (err) return reject(err);
        const isMatch = derivedKey.toString('hex') === storedHashedPasswordHex;
        resolve(isMatch);
      });
    });
  }

  async authenticateUser(
    authRequestDto: LoginRequestDto,
    session: string,
    _requestUrl: string
  ): Promise<TokenResponse> {
    const { username, password } = authRequestDto;
    const user = await userRepository.getUserByUsername(username);

    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        toasterErrors: ['Incorrect username or password.'],
      });
    }

    const isPasswordValid = await this.verifyPassword(password, user.salt, user.hashedPassword);
    if (!isPasswordValid) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        toasterErrors: ['Incorrect username or password.'],
      });
    }

    return this.issueTokens(user.id, session);
  }

  // Creates and stores an access/refresh token pair for this user and session (User-Agent).
  async issueTokens(userId: string, session: string): Promise<TokenResponse> {
    const accessToken = this.generateJwtToken(userId, TokenType.accessToken);
    const refreshToken = this.generateJwtToken(userId, TokenType.refreshToken);
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      await tokenService.storeToken(
        { payload: accessToken, session, type: TokenType.accessToken, user: userId },
        transactionalEntityManager
      );
      await tokenService.storeToken(
        { payload: refreshToken, session, type: TokenType.refreshToken, user: userId },
        transactionalEntityManager
      );
    });
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string, session: string): Promise<TokenResponse> {
    await tokenService.validateRefreshToken(refreshToken);
    const decoded = jwt.decode(refreshToken) as { id: string };
    const userId = decoded.id;
    const newAccessToken = this.generateJwtToken(userId, TokenType.accessToken);
    const newRefreshToken = this.generateJwtToken(userId, TokenType.refreshToken);
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      const existingTokens = await tokenRepository.getActiveTokensBySessionAndUserId(session, userId);
      for (const token of existingTokens) {
        await tokenService.revokeToken(token, transactionalEntityManager);
      }

      await tokenService.storeToken(
        { payload: newAccessToken, session, type: TokenType.accessToken, user: userId },
        transactionalEntityManager
      );
      await tokenService.storeToken(
        { payload: newRefreshToken, session, type: TokenType.refreshToken, user: userId },
        transactionalEntityManager
      );
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(session: string, userId: string): Promise<void> {
    await tokenService.revokeTokensBySessionAndUserId(session, userId);
  }

  generateJwtToken(id: string, tokenType: TokenType): string {
    let jwtKey;
    let jwtExpiresIn;
    switch (tokenType) {
      case TokenType.accessToken:
        jwtKey = env.JWT_ACCESS_TOKEN_KEY;
        jwtExpiresIn = env.JWT_ACCESS_TOKEN_EXPIRES_IN;
        break;
      case TokenType.refreshToken:
        jwtKey = env.JWT_REFRESH_TOKEN_KEY;
        jwtExpiresIn = env.JWT_REFRESH_TOKEN_EXPIRES_IN;
        break;
      default:
        throw new Error(`Unknown token type: ${tokenType}`);
    }
    // jwtid keeps tokens unique: two sign-ins within one second would otherwise produce the same payload.
    return jwt.sign({ id, iat: Math.floor(Date.now() / 1000) }, jwtKey, {
      expiresIn: jwtExpiresIn,
      jwtid: crypto.randomUUID(),
    });
  }
}

const authService = new AuthServive();
export default authService;
