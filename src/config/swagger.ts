import { Request, Response, Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [],
  },
  apis: ['./src/routes/*.ts', './routes/*.js', './src/entities/*.ts', './entities/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: string | number) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.info(`Docs available at ${process.env.BACKEND_URL || 'http://localhost'}:${port}/api/docs`);
}

export default swaggerDocs;
