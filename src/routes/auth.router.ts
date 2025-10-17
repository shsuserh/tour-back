import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import authController from '../controllers/auth.controller';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';

function authRouter(app: Application) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     LoginRequestDto:
   *       type: object
   *       required:
   *        - username
   *        - password
   *       properties:
   *         username:
   *           type: string
   *           description: Login of user.
   *         password:
   *           type: string
   *           description: Password of user.
   */

  /**
   * @openapi
   * /login:
   *  post:
   *     tags:
   *     - Authentication
   *     description: Authenticates a user and returns an access token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequestDto'
   *     responses:
   *       200:
   *         description: Successfully authenticated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: The access token for authentication.
   *                 refreshToken:
   *                   type: string
   *                   description: The refresh token for renewing the access token.
   *       400:
   *         description: Bad request..
   *       500:
   *         description: Internal server error.
   */

  app.post('/login', asyncMiddlewareWrapper(authController.login));

  /**
   * @openapi
   * /refresh:
   *  post:
   *     tags:
   *     - Authentication
   *     description: Refreshes the access token using a valid refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshAccessTokenRequestDto'
   *     responses:
   *       200:
   *         description: Successfully refreshed the access token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: The new access token.
   *                 refreshToken:
   *                   type: string
   *                   description: The new refresh token.
   *       400:
   *         description: Bad request.
   *       401:
   *         description: Unauthorized.
   *       500:
   *         description: Internal server error.
   * components:
   *   schemas:
   *     RefreshAccessTokenRequestDto:
   *       type: object
   *       required:
   *         - refreshToken
   *       properties:
   *         refreshToken:
   *           type: string
   *           description: The refresh token provided by the client.
   */

  app.post('/refresh', asyncMiddlewareWrapper(authController.refreshAccessToken));

  /**
   * @openapi
   * /logout:
   *  post:
   *     tags:
   *     - Authentication
   *     description: Logs out the currently authenticated user. Requires an Authorization header with a valid Bearer token.
   *     security:
   *     - authorization: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  app.post('/logout', asyncMiddlewareWrapper(requireToBeAuthenticated), asyncMiddlewareWrapper(authController.logout));
}

export default authRouter;
