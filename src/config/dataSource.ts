import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from '../entities';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_LOCAL_PORT,
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  entities: [...Object.values(entities)],
  migrations: env.NODE_ENV == 'development' ? ['src/migrations/*.ts'] : ['build/migrations/*.js'],
  subscribers: [],
});
