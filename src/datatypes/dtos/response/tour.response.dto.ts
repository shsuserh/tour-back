import { ServiceAvailabilityLevel, UserAuthLevelForService } from '../../enums/enums';
import { FileDto } from './file.response.dto';
import { CesTemplateResponseDto } from './template.response.dto';

export interface CesListResponseDto {
  id: string;
  createDate: Date;
  isActive: boolean;
  tourName: string;
}

export interface CesInfoDto {
  id: string;
  createDate: Date;
  name: string;
  description: string;
  executionDate: string;
  authLevel: UserAuthLevelForService;
  availabilityLevel: ServiceAvailabilityLevel;
  docsList: Array<{
    id: string;
    isRequired: boolean;
    title: string;
  }>;
  image?: FileDto;
  useFulLinks: CesUsefulLinkResponseDto[];
  useFulFiles: CesUsefulFileResponseDto[];
  path: { id: string; name: string }[];
}

export interface CesUsefulFileResponseDto {
  id: string;
  name: string;
  cesFile: FileDto;
}

export interface CesUsefulLinkResponseDto {
  id: string;
  link: string;
  name: string;
}

export interface CestTemplateResponseDto {
  id: string;
  template: CesTemplateResponseDto;
}

export interface TranslationsResponseDto {
  id: string;
  field: string;
  value: string;
}

export interface TemplateDtoForGetCesById {
  id: string;
  name: string;
}

export interface CesGetByIdResponseDto {
  id: string;
  createDate: Date;
  translations: TranslationsResponseDto[];
  executionDate: string;
  isActive: boolean;
  authLevel: UserAuthLevelForService;
  availabilityLevel: ServiceAvailabilityLevel;
  docsList: Array<{
    id: string;
    isRequired: boolean;
    am: string;
    ru?: string;
    en?: string;
  }>;
  image?: FileDto;
  category: {
    id: string;
    name: string;
  };
  template: TemplateDtoForGetCesById;
}

export interface TrackApplicationDto {
  status: string;
  isFinished: boolean;
  applicationNumber: string;
  cesName: string;
  completionDate: string;
  files: unknown;
}
