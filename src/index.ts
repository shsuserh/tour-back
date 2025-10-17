import 'reflect-metadata';
import { Application } from 'express';
import { AppDataSource } from './config/dataSource';
import initializeApp from './app';

let server: ReturnType<Application['listen']> | undefined;

async function startServer(): Promise<Application> {
  try {
    await AppDataSource.initialize();
    const app = await initializeApp();

    const port = process.env.PORT || 3000;

    server = app.listen(port, () => {
      console.info(`Magic is happening on port ${port}`);
    });

    return app;
  } catch (error) {
    console.error(`Error ---> ${error}`);
    process.exit(1);
  }
}

startServer();

async function shutdown(signal: string) {
  console.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
    }
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch (err) {
    console.error('Error during shutdown:', err);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
