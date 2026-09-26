// Text per language, keyed by LanguageCode ('am' | 'en' | 'ru'); English is the site's fallback.
export type LanguageTexts = { en: string; am?: string; ru?: string };

export interface TourItineraryStep {
  time: string;
  title: LanguageTexts;
  text: LanguageTexts;
}
