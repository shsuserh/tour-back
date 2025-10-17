const whitelist = [
  process.env.BACKEND_URL || 'http://localhost:3030',
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.DEV_API_URL || 'https://dev-eservice-api.yerevan.am',
  process.env.DEV_FRONTEND_URL || 'https://dev-eservice.yerevan.am',
  process.env.PROD_API_URL || 'https://eservice-api.yerevan.am',
  process.env.PROD_FRONTEND_URL || 'https://eservice.yerevan.am',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
