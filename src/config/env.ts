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
};

export type Env = typeof env;
