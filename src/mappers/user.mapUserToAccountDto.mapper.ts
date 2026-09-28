import { User } from '../entities/user.entity';
import { AccountDto } from '../datatypes/dtos/response/account.response.dto';

// Expects user.socialAuths to be loaded; without it every user reads as a password account.
export function mapUserToAccountDto(user: User): AccountDto {
  return {
    id: user.id,
    email: user.email || '',
    firstName: user.name || '',
    lastName: user.lastname || '',
    age: user.age ?? null,
    phone: user.phone || '',
    gender: user.gender || '',
    provider: user.socialAuths?.[0]?.provider || 'password',
  };
}
