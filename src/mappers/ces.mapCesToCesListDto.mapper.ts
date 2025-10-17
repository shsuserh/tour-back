import { CesListResponseDto } from '../datatypes/dtos/response/tour.response.dto';
import { Tour } from '../entities/tour.entity';
import { LanguageCode, TranslationFields } from '../datatypes/enums/enums';

export function mapCesToCesListDto(tour: Tour): CesListResponseDto | null {
  if (!tour) return null;

  const { id, created, isActive, translations } = tour;

  const tourName: string = translations.filter(
    (item) => item.field === TranslationFields.NAME && item.lgCode === LanguageCode.AM
  )[0].value;

  return {
    id,
    createDate: created,
    isActive,
    tourName,
  };
}
