import { LanguageCode, TranslationFields } from '../datatypes/enums/enums';
import { ParentPath } from '../datatypes/internal/tour.internal';
import { Tour } from '../entities/tour.entity';

export function mapCesToCesParentPathDto(
  tour: Tour | null,
  parentPath: ParentPath[],
  lgCode: LanguageCode
): ParentPath[] | null {
  if (!tour) return null;

  const { id, translations } = tour;

  parentPath.unshift({
    id,
    name: translations.filter((item) => item.field === TranslationFields.NAME && item.lgCode === lgCode)[0].value,
  });

  return parentPath;
}
