import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/routes';
import corsOptions from './config/corsOptions';
import swaggerDocs from './config/swagger';
import i18n from 'i18n';
import path from 'path';
import { configurePassportStrategies } from './config/passport';

async function initializeApp(): Promise<Application> {
  const app: Application = express();

  i18n.configure({
    locales: ['am', 'en', 'ru'],
    directory: path.join(process.cwd(), 'locales'),
    defaultLocale: 'am',
    queryParameter: 'lang',
    autoReload: false,
    syncFiles: false,
    cookie: 'locale',
    updateFiles: false,
  });

  app.use(i18n.init);

  app.use((req, res, next) => {
    let lang: string | undefined;

    const { lgcode } = req.headers;

    if (typeof lgcode === 'string') {
      lang = lgcode;
    } else if (Array.isArray(lgcode) && lgcode.length > 0 && typeof lgcode[0] === 'string') {
      lang = lgcode[0];
    }

    if (!lang) {
      lang = 'am';
    }

    if (i18n.getLocales().includes(lang)) {
      req.setLocale(lang);
    } else {
      req.setLocale('am');
    }

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Configure Passport
  configurePassportStrategies();
  app.use(passport.initialize());

  app.use(cors(corsOptions));
  routes(app);
  swaggerDocs(app, parseInt(process.env.PORT || '3000', 10));

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
}

export default initializeApp;
