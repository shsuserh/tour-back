import { Application } from 'express';
import passport from 'passport';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import socialAuthController from '../controllers/socialAuth.controller';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';

function socialAuthRouter(app: Application) {
  /**
   * @openapi
   * /auth/google:
   *  get:
   *     tags:
   *     - Social Authentication
   *     description: Initiates Google OAuth authentication flow
   *     responses:
   *       302:
   *         description: Redirects to Google OAuth consent screen
   */
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  /**
   * @openapi
   * /auth/google/callback:
   *  get:
   *     tags:
   *     - Social Authentication
   *     description: Google OAuth callback endpoint
   *     responses:
   *       302:
   *         description: Redirects to frontend with tokens or error
   */
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/error', session: false }),
    asyncMiddlewareWrapper(socialAuthController.googleCallback)
  );

  // Facebook OAuth routes - Removed due to review requirements

  // Instagram OAuth routes - Removed due to Facebook platform requirements

  /**
   * @openapi
   * /auth/social/linked:
   *  get:
   *     tags:
   *     - Social Authentication
   *     description: Get user's linked social authentication accounts
   *     security:
   *     - authorization: []
   *     responses:
   *       200:
   *         description: Successfully retrieved linked social accounts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       provider:
   *                         type: string
   *                         enum: [google, facebook, instagram]
   *                       email:
   *                         type: string
   *                       name:
   *                         type: string
   *       401:
   *         description: Unauthorized
   */
  app.get(
    '/auth/social/linked',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(socialAuthController.getUserSocialAuths)
  );

  /**
   * @openapi
   * /auth/social/unlink/{provider}:
   *  delete:
   *     tags:
   *     - Social Authentication
   *     description: Unlink a social authentication account
   *     security:
   *     - authorization: []
   *     parameters:
   *     - in: path
   *       name: provider
   *       required: true
   *       schema:
   *         type: string
   *         enum: [google, facebook, instagram]
   *     responses:
   *       200:
   *         description: Successfully unlinked social account
   *       401:
   *         description: Unauthorized
   */
  app.delete(
    '/auth/social/unlink/:provider',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(socialAuthController.unlinkSocialAuth)
  );

  /**
   * @openapi
   * /auth/error:
   *  get:
   *     tags:
   *     - Social Authentication
   *     description: OAuth authentication error page
   *     responses:
   *       200:
   *         description: Error page with details
   */
  app.get('/auth/error', (req, res) => {
    const error = (req.query.error as string) || 'Authentication failed';
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}`;
    res.redirect(redirectUrl);
  });
}

export default socialAuthRouter;
