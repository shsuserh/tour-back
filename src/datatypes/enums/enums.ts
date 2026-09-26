export enum LanguageCode {
  AM = 'am',
  EN = 'en',
  RU = 'ru',
}
export enum TranslationFields {
  NAME = 'name',
  DESCRIPTION = 'description',
}

export enum TokenType {
  accessToken = 'access_token',
  refreshToken = 'refresh_token',
}

export enum UserRole {
  user = 'user',
  superAdmin = 'super_admin',
  admin = 'admin',
}

export enum UserAuthLevelForService {
  noAuth = 'no_auth',
  basic = 'basic_user',
  kyc = 'kyc_user',
  esem = 'esem_user',
}

export enum ServiceAvailabilityLevel {
  individual = 1,
  company = 2,
  both = 3,
}

export enum TourType {
  day = 'day',
  city = 'city',
  multi = 'multi',
  abroad = 'abroad',
}

export enum TourTranslationField {
  title = 'title',
  region = 'region',
  overview = 'overview',
  meeting = 'meeting',
  goodToKnow = 'goodToKnow',
  highlights = 'highlights',
  included = 'included',
  excluded = 'excluded',
}

export enum DesItemType {
  propertyLand = 1,
  land = 2,
  property = 3,
  vehicle = 4,
  trash = 5,
  garage = 6,
}

export enum SocialProvider {
  GOOGLE = 'google',
}
