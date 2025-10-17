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

export enum TourDurationType {
  hour = 1,
  day = 2,
}

export enum DesItemType {
  propertyLand = 1,
  land = 2,
  property = 3,
  vehicle = 4,
  trash = 5,
  garage = 6,
}
