import { Tour } from '../entities/tour.entity';
import { LocalizedDto, TourDto } from '../datatypes/dtos/response/tour.response.dto';
import { LanguageCode } from '../datatypes/enums/enums';
import { LanguageTexts } from '../datatypes/internal/tour.internal';
import { TOUR_LIST_FIELDS } from '../constants/tour.constants';

// The backend stores Armenian as 'am', the site calls it 'hy'.
const toSiteLang = (lgCode: string) => (lgCode === LanguageCode.AM ? 'hy' : lgCode);

const localize = (texts: LanguageTexts): LocalizedDto =>
  Object.fromEntries(Object.entries(texts).map(([lgCode, value]) => [toSiteLang(lgCode), value]));

export function mapTourToTourDto(tour: Tour, baseUrl: string): TourDto {
  const texts: Record<string, LocalizedDto> = {};
  const lists: Record<string, LocalizedDto<string[]>> = {};
  for (const { lgCode, field, value } of tour.translations ?? []) {
    const lang = toSiteLang(lgCode);
    if (TOUR_LIST_FIELDS.includes(field)) (lists[field] ??= {})[lang] = JSON.parse(value);
    else (texts[field] ??= {})[lang] = value;
  }

  return {
    slug: tour.slug,
    type: tour.type,
    region: { key: tour.region, ...texts.region },
    title: texts.title ?? {},
    overview: texts.overview ?? {},
    meeting: texts.meeting,
    goodToKnow: texts.goodToKnow,
    highlights: lists.highlights,
    included: lists.included,
    excluded: lists.excluded,
    itinerary: (tour.itinerary ?? []).map((step) => ({
      time: step.time,
      title: localize(step.title),
      text: localize(step.text),
    })),
    durationHours: tour.durationHours ?? undefined,
    durationDays: tour.durationDays ?? undefined,
    price: tour.price,
    privatePrice: tour.privatePrice ?? undefined,
    privateOnly: tour.privateOnly,
    maxGroup: tour.maxGroup,
    languages: tour.languages.map(toSiteLang),
    popular: tour.popular,
    images: [...(tour.images ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((file) => `${baseUrl}/uploads/${file.name}`),
  };
}
