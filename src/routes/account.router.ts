import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import accountController from '../controllers/account.controller';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';

// Public site accounts (tour-react). The back office keeps using /login, /refresh and /user.
function accountRouter(app: Application) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Account:
   *       type: object
   *       properties:
   *         id: { type: string }
   *         email: { type: string }
   *         firstName: { type: string }
   *         lastName: { type: string }
   *         age: { type: integer, nullable: true }
   *         phone: { type: string }
   *         gender: { type: string, enum: ['', male, female, other] }
   *         provider: { type: string, enum: [password, google] }
   *     AccountSession:
   *       type: object
   *       properties:
   *         token: { type: string, description: "Access token, sent as Authorization: Bearer …" }
   *         refreshToken: { type: string, description: "Exchange at POST /refresh" }
   *         user: { $ref: '#/components/schemas/Account' }
   * /auth/register:
   *   post:
   *     tags: [Account]
   *     summary: Register a public site account and sign in
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [firstName, lastName, email, password]
   *             properties:
   *               firstName: { type: string }
   *               lastName: { type: string }
   *               email: { type: string }
   *               password: { type: string, minLength: 8 }
   *     responses:
   *       201: { description: AccountSession }
   *       400: { description: Validation error }
   *       409: { description: Email is already registered }
   * /auth/login:
   *   post:
   *     tags: [Account]
   *     summary: Sign in to a public site account by email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *     responses:
   *       200: { description: AccountSession }
   *       401: { description: Incorrect email or password }
   * /me:
   *   get:
   *     tags: [Account]
   *     summary: The signed-in account
   *     security: [{ authorization: [] }]
   *     responses:
   *       200: { description: Account }
   *       401: { description: Unauthorized }
   *   patch:
   *     tags: [Account]
   *     summary: Update the signed-in account's profile
   *     security: [{ authorization: [] }]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName: { type: string }
   *               lastName: { type: string }
   *               age: { type: integer, nullable: true }
   *               phone: { type: string }
   *               gender: { type: string, enum: ['', male, female, other] }
   *     responses:
   *       200: { description: Account }
   *       401: { description: Unauthorized }
   */
  app.post('/auth/register', asyncMiddlewareWrapper(accountController.register));
  app.post('/auth/login', asyncMiddlewareWrapper(accountController.login));
  app.get('/me', asyncMiddlewareWrapper(requireToBeAuthenticated), asyncMiddlewareWrapper(accountController.getMe));
  app.patch(
    '/me',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(accountController.updateMe)
  );
}

export default accountRouter;
