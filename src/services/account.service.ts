import userRepository from '../repositories/user.repository';
import userService from './user.service';
import authService from './auth.service';
import { AppError, ERROR_TYPES } from '../errors';
import { AccountUpdatePayload } from '../datatypes/internal/user.internal';
import { mapUserToAccountDto } from '../mappers/user.mapUserToAccountDto.mapper';
import { AccountDto, AccountSessionDto } from '../datatypes/dtos/response/account.response.dto';
import {
  AccountLoginRequestDto,
  AccountRegisterRequestDto,
  AccountUpdateRequestDto,
} from '../datatypes/dtos/request/account.request.dto';

// Accounts of the public site (tour-react): sign-in by email, responses without the back-office envelope.
class AccountService {
  async register(dto: AccountRegisterRequestDto, session: string): Promise<AccountSessionDto> {
    if (await userRepository.getUserByEmail(dto.email)) {
      throw new AppError({
        code: ERROR_TYPES.conflictError,
        toaster: true,
        toasterErrors: ['Email is already registered.'],
      });
    }
    const user = await userService.createUser({
      username: dto.email,
      email: dto.email,
      password: dto.password,
      name: dto.firstName,
      lastname: dto.lastName,
    });
    return this.startSession(user.id, session);
  }

  async login(dto: AccountLoginRequestDto, session: string): Promise<AccountSessionDto> {
    const user = await userRepository.getUserByEmail(dto.email);
    // Social-only accounts have no password.
    const valid =
      user?.hashedPassword &&
      user.salt &&
      (await authService.verifyPassword(dto.password, user.salt, user.hashedPassword));
    if (!user || !valid) {
      throw new AppError({
        code: ERROR_TYPES.unauthorizedError,
        toaster: true,
        toasterErrors: ['Incorrect email or password.'],
      });
    }
    return this.startSession(user.id, session);
  }

  async getMe(id: string): Promise<AccountDto> {
    const user = await userRepository.getUserWithSocialAuths(id);
    if (!user) throw new AppError({ code: ERROR_TYPES.unauthorizedError });
    return mapUserToAccountDto(user);
  }

  async updateMe(id: string, dto: AccountUpdateRequestDto): Promise<AccountDto> {
    const { firstName, lastName, age, phone, gender } = dto;
    // Only the fields that were sent; null clears age.
    const changes = Object.fromEntries(
      Object.entries({ name: firstName, lastname: lastName, age, phone, gender }).filter(([, v]) => v !== undefined)
    ) as AccountUpdatePayload;
    if (Object.keys(changes).length) await userRepository.updateUser(id, changes);
    return this.getMe(id);
  }

  private async startSession(userId: string, session: string): Promise<AccountSessionDto> {
    const { accessToken, refreshToken } = await authService.issueTokens(userId, session);
    return { token: accessToken, refreshToken, user: await this.getMe(userId) };
  }
}

const accountService = new AccountService();
export default accountService;
