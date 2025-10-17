import { User } from '../entities/user.entity';
import { UserProfileDto } from '../datatypes/dtos/response/user.response.dto';

export function mapUserToUserProfileDto(user: User): UserProfileDto | null {
  if (!user) return null;
  const { id, name, lastname, role } = user;
  return {
    id,
    name,
    lastname,
    role,
  };
}
