import { TokenType } from '../enums/enums';

export interface YidTokenResponse {
  token_type: string;
  expires_in: number;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type TokenPayload = {
  payload: string;
  session: string;
  type: TokenType;
  user: string;
};
