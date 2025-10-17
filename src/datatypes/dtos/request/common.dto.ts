import {
  IsString,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  IsUUID,
  ValidateNested,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  NotEquals,
  Validate,
  MinLength,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { TranslationFields, LanguageCode } from '../../enums/enums';
import { IsUnique } from '../../../decorators/isUnique.decorator';
import { VALIDATION_ERROR_MESSAGES } from '../../../constants/common.constants';
import { ValidateCategoryTranslationValueLength } from '../../../utils/validateCategoryTranslationValueLength';
import { ValidateCategoryTranslationValue } from '../../../utils/validateCategoryTranslationValue';

@Exclude()
export class IdDto {
  @Expose()
  @IsUUID()
  id!: string;
}

@Exclude()
export class OptionalIdDto {
  @Expose()
  @IsUUID()
  @IsOptional()
  id?: string;
}

@Exclude()
export class LanguageCodeDto {
  @Expose()
  @IsOptional()
  @IsEnum(LanguageCode)
  lgCode!: LanguageCode;
}

@Exclude()
class Order {
  @Expose()
  @IsUUID()
  @IsString()
  id!: string;

  @Expose()
  @IsInt()
  @IsPositive()
  order!: number;
}

export class ReorderDto {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Order)
  @IsUnique('order', { each: true, message: VALIDATION_ERROR_MESSAGES.reorderOrderNotUniqueError })
  @ArrayMinSize(1) // at least one banner order is required
  orders!: Order[];
}

@Exclude()
export class TranslationDto {
  @Expose()
  @IsEnum(LanguageCode, { message: VALIDATION_ERROR_MESSAGES.validateLanguage })
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  lgCode!: LanguageCode;

  @Expose()
  @IsEnum(TranslationFields, { message: VALIDATION_ERROR_MESSAGES.validateField })
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  field!: TranslationFields;

  @Expose()
  @NotEquals(null, { message: VALIDATION_ERROR_MESSAGES.requiredField })
  @Validate(ValidateCategoryTranslationValueLength, { message: VALIDATION_ERROR_MESSAGES.validateField })
  @Validate(ValidateCategoryTranslationValue, { message: VALIDATION_ERROR_MESSAGES.requiredField })
  value!: string;
}

@Exclude()
export class LanguagesDto {
  @Expose()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  am!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  en?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  ru?: string;
}

export class PaginationDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page!: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit!: number;
}

export class SearchDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: VALIDATION_ERROR_MESSAGES.searchLengthValidationErrorMessage })
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  search?: string;
}
