import { Application } from 'express';
import tourRouter from './tour.router';
import authRouter from './auth.router';
import userRouter from './user.router';
import globalRouter from './global.router';
import socialAuthRouter from './socialAuth.router';
import accountRouter from './account.router';

function routes(app: Application) {
  authRouter(app);
  socialAuthRouter(app);
  accountRouter(app);
  tourRouter(app);
  userRouter(app);
  globalRouter(app);
}

export default routes;
