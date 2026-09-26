export interface TranslationsResponseDto {
  id: string;
  field: string;
  value: string;
}

// Text per frontend language code ('hy' | 'en' | 'ru'); the site falls back to English.
export type LocalizedDto<T = string> = Partial<Record<'hy' | 'en' | 'ru', T>>;

// Public tour shape, matching the contract in tour-react/src/data/mockData.js
export interface TourDto {
  slug: string;
  type: string;
  region: { key: string } & LocalizedDto;
  title: LocalizedDto;
  overview: LocalizedDto;
  meeting?: LocalizedDto;
  goodToKnow?: LocalizedDto;
  highlights?: LocalizedDto<string[]>;
  included?: LocalizedDto<string[]>;
  excluded?: LocalizedDto<string[]>;
  itinerary: { time: string; title: LocalizedDto; text: LocalizedDto }[];
  durationHours?: number;
  durationDays?: number;
  price: number;
  privatePrice?: number;
  privateOnly: boolean;
  maxGroup: number;
  languages: string[];
  popular: boolean;
  images: string[];
}
