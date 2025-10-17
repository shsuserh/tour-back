export const VALIDATION_ERROR_MESSAGES = {
  requiredField: 'Դաշտը լրացնելը պարտադիր է',
  validateField: 'Տրամադրված դաշտը վավեր չէ',
  validateLanguage: 'EN,RU,AM  Տրամադրված լեզուն վավեր չէ',
  validateFileType: 'Կից ֆայլը պետք է լինի հետևյալ ֆորմատի։',
  validateFileSize: 'Կից ֆայլը պետք է լինի առավելագույնը 5 MB',
  fileIsRequiredErrorMessage: 'Ֆայլը պարտադիր է',
  reorderOrderNotUniqueError: 'Հաջորդականության տվայլները վավեր չեն',
  validateFileExistence: 'Ֆայլը գոյություն չունի',
  fileIsRequired: 'Դաշտը պարտադիր է լրացման համար',
  fileFieldFormatErrorMessage: 'Ֆայլ դաշտը պետք է լինի uuid ֆորմատի',
  itemUpdateErrorMessage: 'Տվյալի խմբագրումը չի հաջողվել',
  statusUpdateSuccessMessage: 'Կարգավիճակը հաջողությամբ խմբագրված է',
  commonAllowedFileFormats: 'JPG, JPEG, PNG, SVG',
  emailValidationErrorMessage: 'Էլեկտրոնային հասցեի ձևաչափը սխալ է',
  phoneDigitValidationErrorMessage: 'Հեռախոսահամարի ձևաչափը սխալ է',
  phoneLengthValidationErrorMessage: 'Մուտքագրեք 8 թիվ',
  searchLengthValidationErrorMessage: 'Մուտքագրեք առնվազն 3 նիշ',
};

export const COMMON_ERROR_MESSAGES = {
  cronJobError: 'Cron Job Error',
  globalError: 'Գործողությունը չի հաջողվել',
  serviceIsUnavailable: 'Ծառայությունն այս պահին անհասանելի է',
};

export const ALLOWED_FILE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpeg', 'image/svg+xml'];

export const FILE_MAX_SIZE = 5 * 1024 * 1024;
export const NUMBER_OF_DAYS_SINCE_NOW = 2;
export const FILE_UPLOAD_FOLDER = '/uploads/';
export const PRIVATE_FILE_UPLOAD_FOLDER = '/uploads/private/';
export const PHONE_PREFIX = '+374';

export const PAGINATION_DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
};

export const MULTER_FILE_LIMIT_ERROR_CODE = 'LIMIT_FILE_SIZE';
export const AUTH_TOKEN_PREFIX = `Bearer`;
export const LOCAL_REFERER_URL = `http://localhost`;

export const EMAIL_VALIDATION_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_DIGIT_VALIDATION_REGEXP = /^[0-9]+$/;

export const PHONE_LENGTH_VALIDATION = 8;
