import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { VALIDATION_ERROR_MESSAGES } from '../../../constants/common.constants';

@Exclude()
export class CreateUserRequestDto {
  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  username!: string;

  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  password!: string;

  @Expose()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsString()
  confirmPassword!: string;

}

@Exclude()
export class PersonDto {
  @Expose()
  @Length(9, 9, { message: 'docNumber_characters' })
  @IsNotEmpty({ message: 'required_filed' })
  docNumber!: string;

  @Expose()
  @Length(10, 11, { message: 'ssn_characters' })
  @IsNotEmpty({ message: 'required_filed' })
  ssn!: string;
}
