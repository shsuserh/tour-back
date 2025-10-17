import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { LanguagesDto, TranslationDto } from './common.dto';
import { IsUniqueWithAmNameCheck } from '../../../decorators/isUniqueWithAmNameCheck.decorator';
import { VALIDATION_ERROR_MESSAGES } from '../../../constants/common.constants';
import { IsCodeValid } from '../../../decorators/IsCodeValid.decorator';
import { MULBERRY_TRACKING_ID_REGEXP } from '../../../constants/mulberry.constants';

@Exclude()
export class CesStatusUpdateRequestDto {
  @Expose()
  @IsBoolean()
  isActive!: boolean;
}
@Exclude()
export class UseFullLinksDto extends LanguagesDto {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string;

  @Expose()
  @IsUrl({}, { message: VALIDATION_ERROR_MESSAGES.validateField })
  link!: string;
}
@Exclude()
export class DocsListDto extends LanguagesDto {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string;

  @Expose()
  @IsBoolean()
  isRequired?: boolean;
}

@Exclude()
export class UseFulFileDto extends LanguagesDto {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string;

  @Expose()
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateFileType })
  @IsUUID('all', { message: VALIDATION_ERROR_MESSAGES.validateField })
  fileId!: string;
}
@Exclude()
export class TourRequestDto {


  @Expose()
  @IsOptional()
  @ValidateIf((obj) => obj.imageId !== null)
  @IsString({ message: VALIDATION_ERROR_MESSAGES.validateFileType })
  @IsUUID()
  imageId?: string | null;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;



  @Expose()
  @IsArray()
  @ArrayNotEmpty({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  @IsUniqueWithAmNameCheck({ message: VALIDATION_ERROR_MESSAGES.validateField })
  @IsCodeValid({ message: VALIDATION_ERROR_MESSAGES.validateLanguage })
  translations!: TranslationDto[];




}

@Exclude()
export class CesSubmitDocumentDetailsDto {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastname?: string;

  @Expose()
  @IsOptional()
  @IsString()
  ssn?: string;

  @Expose()
  @IsOptional()
  @IsString()
  email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  address!: string;

  @Expose()
  @IsOptional()
  @IsString()
  tin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  companyName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  companyType?: string;
}

@Exclude()
export class CesSubmitDocumentJsonDataDto {
  @Expose()
  @IsOptional()
  @IsObject()
  details?: CesSubmitDocumentDetailsDto;

  @Expose()
  @IsOptional()
  @IsString()
  yid?: string;

  @Expose()
  @IsOptional()
  @IsString()
  uid?: string;
}

@Exclude()
export class CesSubmitDocumentDto {
  @Expose()
  @IsNotEmpty()
  @Type(() => CesSubmitDocumentJsonDataDto)
  jsonData!: CesSubmitDocumentJsonDataDto;
}

@Exclude()
export class TrackApplicationDto {
  @Expose()
  @Matches(MULBERRY_TRACKING_ID_REGEXP, {
    message: 'trackingId must be in the format XXXX-XXXX-XXXX-XXXX (e.g. F893-8C9D-1B2D-7D8F)',
  })
  @IsString({ message: 'trackingId must be a string' })
  @IsNotEmpty({ message: 'trackingId is required' })
  trackingId!: string;
}
