import { TourTranslationField } from '../datatypes/enums/enums';

export const TOUR_MESSAGES = {
  successCreate: 'Տուրը հաջողությամբ ավելացված է',
  deleteSuccessMessage: 'Տուրը հաջողությամբ հեռացված է։',
  notFoundErrorMessage: 'Տուրը գոյություն չունի',
  notFoundUpdateErrorMessage: 'Խմբագրվող տուրը գոյություն չունի',
  slugTakenErrorMessage: 'Այս slug-ով տուր արդեն գոյություն ունի',
  statusUpdateSuccessMessage: 'Տուրը հաջողությամբ խմբագրված է',
  allowedImageFormats: 'JPG, JPEG, PNG, SVG',
  allowedUsefulFileFormats: 'PDF',
  allowedRequiredDocsFileFormats: 'Կից ֆայլը պետք է լինի PDF, JPG, JPEG, PNG ֆորմատի',
};

export const TOUR_GENERATE_TEMPLATE_FILE_EXTENSION = '.pdf';
export const ALLOWED_TOUR_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpeg', 'image/svg+xml'];
export const ALLOWED_TOUR_USEFUL_FILE_MIME_TYPES = ['application/pdf'];
export const ALLOWED_REQUIRED_DOCS_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Translation fields whose value is a list, stored as a JSON array string.
export const TOUR_LIST_FIELDS: string[] = [
  TourTranslationField.highlights,
  TourTranslationField.included,
  TourTranslationField.excluded,
];
