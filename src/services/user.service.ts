import { EntityManager } from 'typeorm';
import { CreateUserPayload, UserUpdatePayload } from '../datatypes/internal/user.internal';
import { TransactionManager } from '../utils/transaction/transactionManager';
import userRepository from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { AppError, ERROR_TYPES } from '../errors';
import { USER_ERROR_MESSAGES } from '../constants/user.constants';
import crypto from 'crypto';

class UserService {
  async createUser(userPayload: CreateUserPayload): Promise<void> {
    const salt = crypto.randomBytes(16);

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(userPayload.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
        if (err) {
          reject(
            new AppError({
              code: ERROR_TYPES.badRequestError,
              toaster: true,
              toasterErrors: ['Technical error occurred while creating user'],
            })
          );
          return;
        }

        try {
          userPayload.hashedPassword = hashedPassword.toString('hex');
          userPayload.salt = salt.toString('hex');

          const transactionManager = new TransactionManager();

          await transactionManager.runInTransaction(async (transactionalEntityManager: EntityManager) => {
            await userRepository.createUser(userPayload, transactionalEntityManager);
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getUsers(): Promise<User[]> {
    return userRepository.getUsers();
  }

  async updateUser(id: string, updateUserPayload: UserUpdatePayload): Promise<void> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        toasterErrors: ['User that you are trying to update does not exist'],
      });
    }
    await userRepository.updateUser(id, updateUserPayload);
  }

  async deleteUser(requesterId: string, userIdToDelete: string): Promise<void> {
    if (requesterId === userIdToDelete) {
      throw new AppError({
        code: ERROR_TYPES.forbiddenError,
        toaster: true,
        toasterErrors: [USER_ERROR_MESSAGES.requesterAndTheUserToDeleteAreTheSameErrorMessage],
      });
    }

    const user = await userRepository.getUserById(userIdToDelete);
    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [USER_ERROR_MESSAGES.notFoundErrorMessage],
      });
    }

    await userRepository.deleteUser(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [USER_ERROR_MESSAGES.notFoundErrorMessage],
      });
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        toasterErrors: [USER_ERROR_MESSAGES.notFoundErrorMessage],
      });
    }
    return user;
  }
}

const userService = new UserService();
export default userService;
