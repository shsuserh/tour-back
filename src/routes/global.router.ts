import { Application } from 'express';
import path from 'path';
import express from 'express';

function globalRouter(app: Application) {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}

export default globalRouter;
