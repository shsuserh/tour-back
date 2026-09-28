export interface YidUserData {
  data: {
    username: string;
    email: string;
    roles: string[];
    phone: string;
    uId: string;
    profile: {
      name: string;
      lastname: string;
      ssn: string;
      birthDate: string;
      status: number;
      gender: number;
      image: { id: number; path: string };
      fromYerevan: boolean;
      yId: string | null;
      kycPending: boolean;
    };
    passwordChangedAt: string;
    emailVerified: boolean;
    success: boolean;
  };
}

export type UserUpdatePayload = {
  username: string;
  email: string;
  phone: string;
  uid: string;
  name: string;
  lastname: string;
  ssn: string;
  status: number;
  gender: string;
  image: string;
};

// Profile fields the public site can edit (PATCH /me).
export type AccountUpdatePayload = Partial<{
  name: string;
  lastname: string;
  age: number | null;
  phone: string;
  gender: string;
}>;

export type CreateUserPayload = {
  username: string;
  password?: string;
  hashedPassword?: string;
  salt?: string;
  email?: string;
  name?: string;
  lastname?: string;
  image?: string;
};
