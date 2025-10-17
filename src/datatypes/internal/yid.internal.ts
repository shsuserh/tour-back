export interface UserInfo {
  phone: string;
  uId: string;
  email?: string;
}

export type YidResponseUserProfileInfo = {
  name: string;
  lastname: string;
  ssn: string;
  birthDate: string;
  status: number;
  gender: number;
  user: UserInfo;
  fromYerevan: boolean;
  yId: string;
  ekengPassportImageString: string | null;
  KycVerification: Record<string, unknown> | null;
  statusString: string;
  genderString: string;
  success: boolean;
};
