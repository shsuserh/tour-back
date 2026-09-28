import crypto from 'crypto';
import { EntityManager } from 'typeorm';
import userRepository from '../repositories/user.repository';
import tokenRepository from '../repositories/token.repository';
import mailService from './mail.service';
import { TransactionManager } from '../utils/transaction/transactionManager';
import { whitelist } from '../config/corsOptions';
import { env } from '../config/env';
import { PASSWORD_RESET_EMAIL, PASSWORD_RESET_RESEND_MS, PASSWORD_RESET_TTL_MS } from '../constants/account.constants';
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
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from '../datatypes/dtos/request/account.request.dto';

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

// The site page that opens reset links: the one the request names if its origin is trusted, else SITE_URL.
const resetPage = (requested?: string): string => {
  try {
    if (requested && whitelist.includes(new URL(requested).origin)) return requested;
  } catch {
    // not a URL, fall through
  }
  return `${env.SITE_URL}/reset-password`;
};

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

  // Always succeeds silently, so the response never reveals whether an email is registered.
  async forgotPassword(dto: ForgotPasswordRequestDto): Promise<void> {
    const user = await userRepository.getUserByEmail(dto.email);
    if (!user?.email) return;
    const lastSent = user.passwordResetExpires ? user.passwordResetExpires.getTime() - PASSWORD_RESET_TTL_MS : 0;
    if (Date.now() - lastSent < PASSWORD_RESET_RESEND_MS) return;

    const token = crypto.randomBytes(32).toString('base64url');
    await userRepository.updateUser(user.id, {
      passwordResetTokenHash: sha256(token),
      passwordResetExpires: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    });

    const url = new URL(resetPage(dto.resetUrl));
    url.searchParams.set('token', token);
    const mail = PASSWORD_RESET_EMAIL[dto.lang || 'hy'];
    // Not awaited: SMTP latency would otherwise tell registered emails apart from unknown ones.
    mailService
      .send({ to: user.email, subject: mail.subject, text: mail.text(url.toString()) })
      .catch((err) => console.error('Password reset email failed:', err));
  }

  // Sets the new password, signs out every other session, and signs this browser in.
  async resetPassword(dto: ResetPasswordRequestDto, session: string): Promise<AccountSessionDto> {
    const user = await userRepository.getUserByPasswordResetHash(sha256(dto.token));
    if (!user) {
      throw new AppError({
        code: ERROR_TYPES.badRequestError,
        toaster: true,
        toasterErrors: ['This reset link is invalid or has expired.'],
      });
    }
    const password = await userService.hashPassword(dto.password);
    await new TransactionManager().runInTransaction(async (manager: EntityManager) => {
      await userRepository.updateUser(
        user.id,
        { ...password, passwordResetTokenHash: null, passwordResetExpires: null },
        manager
      );
      await tokenRepository.revokeAllForUser(user.id, manager);
    });
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
