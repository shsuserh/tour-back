import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),

  POSTGRES_HOST: requireEnv('POSTGRES_HOST'),
  POSTGRES_LOCAL_PORT: parseInt(requireEnv('POSTGRES_LOCAL_PORT'), 10),
  POSTGRES_USERNAME: requireEnv('POSTGRES_USERNAME'),
  POSTGRES_PASSWORD: requireEnv('POSTGRES_PASSWORD'),
  POSTGRES_DATABASE: requireEnv('POSTGRES_DATABASE'),

  JWT_ACCESS_TOKEN_KEY: requireEnv('JWT_ACCESS_TOKEN_KEY'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: requireEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
  JWT_REFRESH_TOKEN_KEY: requireEnv('JWT_REFRESH_TOKEN_KEY'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: requireEnv('JWT_REFRESH_TOKEN_EXPIRES_IN'),

  // Social Authentication
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3030',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // Facebook OAuth
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',

  // Instagram OAuth
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || '',
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET || '',
};

export type Env = typeof env;
