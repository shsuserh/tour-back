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
   * /auth/forgot-password:
   *   post:
   *     tags: [Account]
   *     summary: Email a password reset link (same response whether or not the email is registered)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email: { type: string }
   *               resetUrl: { type: string, description: "Site page for the link, e.g. https://site/en/reset-password" }
   *               lang: { type: string, enum: [hy, en, ru] }
   *     responses:
   *       204: { description: Accepted }
   *       400: { description: Validation error }
   * /auth/reset-password:
   *   post:
   *     tags: [Account]
   *     summary: Set a new password with the emailed token; signs out other sessions and signs in
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [token, password]
   *             properties:
   *               token: { type: string }
   *               password: { type: string, minLength: 8 }
   *     responses:
   *       200: { description: AccountSession }
   *       400: { description: Invalid or expired link, or validation error }
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
  app.post('/auth/forgot-password', asyncMiddlewareWrapper(accountController.forgotPassword));
  app.post('/auth/reset-password', asyncMiddlewareWrapper(accountController.resetPassword));
  app.get('/me', asyncMiddlewareWrapper(requireToBeAuthenticated), asyncMiddlewareWrapper(accountController.getMe));
  app.patch(
    '/me',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(accountController.updateMe)
  );
}

export default accountRouter;
