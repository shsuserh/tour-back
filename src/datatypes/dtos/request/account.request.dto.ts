import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { VALIDATION_ERROR_MESSAGES } from '../../../constants/common.constants';

const toLowerTrimmed = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

@Exclude()
export class AccountLoginRequestDto {
  @Expose()
  @Transform(toLowerTrimmed)
  @IsEmail()
  email!: string;

  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  password!: string;
}

@Exclude()
export class AccountRegisterRequestDto extends AccountLoginRequestDto {
  @Expose()
  @IsString()
  @MinLength(8)
  declare password: string;

  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  @MaxLength(100)
  lastName!: string;
}

@Exclude()
export class AccountUpdateRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @MaxLength(100)
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @MaxLength(100)
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number | null;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @Expose()
  @IsOptional()
  @IsIn(['', 'male', 'female', 'other'])
  gender?: string;
}
