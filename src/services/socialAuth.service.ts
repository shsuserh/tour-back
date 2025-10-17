import { EntityManager } from 'typeorm';
import { SocialAuth } from '../entities/socialAuth.entity';
import { SocialProvider } from '../datatypes/enums/enums';
import { User } from '../entities/user.entity';
import socialAuthRepository from '../repositories/socialAuth.repository';
import userRepository from '../repositories/user.repository';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { AppError, ERROR_TYPES } from '../errors';
import { TokenResponse } from '../datatypes/internal/token.internal';
import { TokenType } from '../datatypes/enums/enums';
import authService from './auth.service';

export interface SocialAuthProfile {
  provider: SocialProvider;
  providerId: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  rawData?: Record<string, unknown>;
}

class SocialAuthService {
  async findOrCreateUser(profile: SocialAuthProfile, session: string): Promise<TokenResponse> {
    const transactionManager = new TransactionManager();
    let result: TokenResponse | null = null;

    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      // Check if social auth already exists
      let socialAuth = await socialAuthRepository.findByProviderAndProviderId(
        profile.provider,
        profile.providerId,
        transactionalEntityManager
      );

      let user: User;

      if (socialAuth) {
        // User exists, get the user
        user = socialAuth.user;
      } else {
        // Check if user exists by email (if provided)
        if (profile.email) {
          const existingUser = await userRepository.getUserByEmail(profile.email);
          if (existingUser) {
            // Link social auth to existing user
            socialAuth = await socialAuthRepository.createSocialAuth(
              {
                provider: profile.provider,
                providerId: profile.providerId,
                email: profile.email,
                name: profile.name,
                firstName: profile.firstName,
                lastName: profile.lastName,
                picture: profile.picture,
                rawData: profile.rawData,
                userId: existingUser.id,
              },
              transactionalEntityManager
            );
            user = existingUser;
          } else {
            // Create new user
            user = await this.createUserFromSocialProfile(profile, transactionalEntityManager);
            socialAuth = await socialAuthRepository.createSocialAuth(
              {
                provider: profile.provider,
                providerId: profile.providerId,
                email: profile.email,
                name: profile.name,
                firstName: profile.firstName,
                lastName: profile.lastName,
                picture: profile.picture,
                rawData: profile.rawData,
                userId: user.id,
              },
              transactionalEntityManager
            );
          }
        } else {
          // No email provided, create new user
          user = await this.createUserFromSocialProfile(profile, transactionalEntityManager);
          socialAuth = await socialAuthRepository.createSocialAuth(
            {
              provider: profile.provider,
              providerId: profile.providerId,
              email: profile.email,
              name: profile.name,
              firstName: profile.firstName,
              lastName: profile.lastName,
              picture: profile.picture,
              rawData: profile.rawData,
              userId: user.id,
            },
            transactionalEntityManager
          );
        }
      }

      // Generate tokens
      const accessToken = authService.generateJwtToken(user.id, TokenType.accessToken);
      const refreshToken = authService.generateJwtToken(user.id, TokenType.refreshToken);

      // Store tokens
      const tokenService = (await import('./token.service')).default;
      await tokenService.storeToken(
        { payload: accessToken, session, type: TokenType.accessToken, user: user.id },
        transactionalEntityManager
      );
      await tokenService.storeToken(
        { payload: refreshToken, session, type: TokenType.refreshToken, user: user.id },
        transactionalEntityManager
      );

      result = { accessToken, refreshToken };
    });

    if (!result) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        toasterErrors: ['Failed to create social authentication user'],
      });
    }

    return result;
  }

  private async createUserFromSocialProfile(
    profile: SocialAuthProfile,
    transactionalEntityManager: EntityManager
  ): Promise<User> {
    // Generate a unique username
    const baseUsername = profile.email?.split('@')[0] || `${profile.provider}_${profile.providerId}`;
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (await userRepository.getUserByUsername(username)) {
      username = `${baseUsername}_${counter}`;
      counter++;
    }

    const userData = {
      username,
      email: profile.email,
      name: profile.name || profile.firstName,
      lastname: profile.lastName,
      image: profile.picture,
      // No password for social auth users
      hashedPassword: undefined,
      salt: undefined,
    };

    return userRepository.createUser(userData, transactionalEntityManager);
  }

  async unlinkSocialAuth(userId: string, provider: SocialProvider): Promise<void> {
    const transactionManager = new TransactionManager();
    await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.delete(SocialAuth, { userId, provider });
    });
  }

  async getUserSocialAuths(userId: string): Promise<SocialAuth[]> {
    return socialAuthRepository.findByUserId(userId);
  }
}

const socialAuthService = new SocialAuthService();
export default socialAuthService;
