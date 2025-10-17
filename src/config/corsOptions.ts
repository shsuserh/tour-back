

const whitelist = [
  'http://127.0.0.1',
  'http://localhost:3030',
  'http://localhost:3000',
  'https://dev-eservice-api.yerevan.am',
  'https://dev-eservice.yerevan.am',
  'https://eservice-api.yerevan.am',
  'https://eservice.yerevan.am',
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
