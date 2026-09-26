import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsUniqueWithAmNameCheck } from '../../../decorators/isUniqueWithAmNameCheck.decorator';
import { VALIDATION_ERROR_MESSAGES } from '../../../constants/common.constants';
import { IsCodeValid } from '../../../decorators/IsCodeValid.decorator';
import { LanguageCode, TourTranslationField, TourType } from '../../enums/enums';
import { TOUR_LIST_FIELDS } from '../../../constants/tour.constants';

@Exclude()
export class TourStatusUpdateRequestDto {
  @Expose()
  @IsBoolean()
  isActive!: boolean;
}

// List fields (highlights, included, excluded) take string[], the rest take a string.
@ValidatorConstraint()
class TourTranslationValue implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const nonEmpty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
    return TOUR_LIST_FIELDS.includes(args.object['field'])
      ? Array.isArray(value) && value.every(nonEmpty)
      : nonEmpty(value);
  }
}

@ValidatorConstraint()
class OnlyOneDuration implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    return args.object['durationHours'] == null;
  }
}

@Exclude()
export class TourTranslationDto {
  @Expose()
  @IsEnum(LanguageCode, { message: VALIDATION_ERROR_MESSAGES.validateLanguage })
  lgCode!: LanguageCode;

  @Expose()
  @IsEnum(TourTranslationField, { message: VALIDATION_ERROR_MESSAGES.validateField })
  field!: TourTranslationField;

  @Expose()
  @Validate(TourTranslationValue, { message: VALIDATION_ERROR_MESSAGES.validateField })
  value!: string | string[];
}

// English is required because the site falls back to it when a language is missing.
@Exclude()
export class ItineraryTextDto {
  @Expose()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  en!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  am?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateField })
  ru?: string;
}

@Exclude()
export class TourItineraryStepDto {
  @Expose()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: VALIDATION_ERROR_MESSAGES.validateField })
  time!: string;

  @Expose()
  @ValidateNested()
  @Type(() => ItineraryTextDto)
  title!: ItineraryTextDto;

  @Expose()
  @ValidateNested()
  @Type(() => ItineraryTextDto)
  text!: ItineraryTextDto;
}

@Exclude()
export class TourRequestDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Expose()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: VALIDATION_ERROR_MESSAGES.validateField })
  slug!: string;

  @Expose()
  @IsEnum(TourType, { message: VALIDATION_ERROR_MESSAGES.validateField })
  type!: TourType;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  region!: string;

  // Exactly one of durationHours / durationDays: hours is required unless days is given,
  // and days is rejected when hours is also given.
  @Expose()
  @ValidateIf((obj) => obj.durationHours != null || obj.durationDays == null)
  @IsInt({ message: VALIDATION_ERROR_MESSAGES.requiredField })
  @IsPositive()
  durationHours?: number | null;

  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Validate(OnlyOneDuration, { message: VALIDATION_ERROR_MESSAGES.validateField })
  durationDays?: number | null;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @Expose()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  privatePrice?: number | null;

  @Expose()
  @IsOptional()
  @IsBoolean()
  privateOnly?: boolean;

  @Expose()
  @IsInt()
  @IsPositive()
  maxGroup!: number;

  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(Object.values(LanguageCode), { each: true, message: VALIDATION_ERROR_MESSAGES.validateLanguage })
  languages!: LanguageCode[];

  @Expose()
  @IsOptional()
  @IsBoolean()
  popular?: boolean;

  // Ordered gallery; the first image is the cover.
  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true, message: VALIDATION_ERROR_MESSAGES.validateField })
  imageIds?: string[];

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourItineraryStepDto)
  itinerary?: TourItineraryStepDto[];

  @Expose()
  @IsArray()
  @ArrayNotEmpty({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @ValidateNested({ each: true })
  @Type(() => TourTranslationDto)
  @IsUniqueWithAmNameCheck({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @IsCodeValid(TourTranslationField.title, { message: VALIDATION_ERROR_MESSAGES.validateLanguage })
  translations!: TourTranslationDto[];
}
