// User of the public site (tour-react src/data/api.js).
export type AccountDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number | null;
  phone: string;
  gender: string;
  provider: string;
};

export type AccountSessionDto = {
  token: string;
  refreshToken: string;
  user: AccountDto;
};
