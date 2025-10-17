import { CesGetByIdResponseDto } from '../datatypes/dtos/response/tour.response.dto';
import { Tour } from '../entities/tour.entity';
import { LanguageCode, TranslationFields } from '../datatypes/enums/enums';

export function mapCesToCesGetByIdDto(tour: Tour): CesGetByIdResponseDto | null {
  if (!tour) return null;

  const {
    id,
    image,
    created,
    executionDate,
    translations,
    template: cesTemplate,
    docsList,
    useFulFiles,
    useFulLinks,
    category,
    isActive,
    authLevel,
    availabilityLevel,
  } = tour;

  return {
    id,
    image,
    createDate: created,
    executionDate,
    isActive,
    translations,
    authLevel,
    availabilityLevel,
    template: {
      id: cesTemplate.id,
      name: cesTemplate.name,
    },
    docsList,
    useFulLinks,
    useFulFiles,
    category: {
      id: category.id,
      name:
        category?.translations?.find(
          (translation) => translation.field === TranslationFields.NAME && translation.lgCode === LanguageCode.AM
        )?.value ?? '',
    },
  };
}
