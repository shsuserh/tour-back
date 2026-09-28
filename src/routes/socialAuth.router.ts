import { Application, Request } from 'express';
import passport from 'passport';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import socialAuthController from '../controllers/socialAuth.controller';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';
import crypto from 'crypto';
import { env } from '../config/env';

// OAuth state is "<nonce>.<redirect>". The nonce is also kept in an HttpOnly cookie on this origin, so a
// callback link started by someone else (login CSRF) is rejected: their state won't match the victim's cookie.
const NONCE_COOKIE = 'oauth_nonce';
const nonceCookie = (req: Request) =>
  (req.headers.cookie || '')
    .split(';')
    .map((c) => c.trim().split('='))
    .find(([k]) => k === NONCE_COOKIE)?.[1];

function socialAuthRouter(app: Application) {
  /**
   * @openapi
   * /auth/google:
   *  get:
   *     tags:
   *     - Social Authentication
   *     description: Initiates Google OAuth authentication flow
   *     parameters:
   *     - in: query
   *       name: redirect
   *       schema:
   *         type: string
   *       description: Public site page to return to as redirect#token=…&refreshToken=… (origin must be allowed by CORS)
   *     responses:
   *       302:
   *         description: Redirects to Google OAuth consent screen
   */
  app.get('/auth/google', (req, res, next) => {
    // The public site's return URL rides along in OAuth state; the callback checks its origin before use.
    const nonce = crypto.randomBytes(16).toString('hex');
    const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : '';
    res.cookie(NONCE_COOKIE, nonce, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
      path: '/auth/google/callback',
    });
    passport.authenticate('google', { scope: ['profile', 'email'], session: false, state: `${nonce}.${redirect}` })(
      req,
      res,
      next
    );
  });

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
  app.get('/auth/google/callback', (req, res, next) => {
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const expected = nonceCookie(req);
    res.clearCookie(NONCE_COOKIE, { path: '/auth/google/callback' });
    if (!expected || state.split('.')[0] !== expected) return socialAuthController.googleFailure(req, res);

    // Custom callback so a failure (e.g. consent denied) can still return to the public site.
    passport.authenticate('google', { session: false }, (err: unknown, profile: Express.User | false) => {
      if (err || !profile) return socialAuthController.googleFailure(req, res);
      req.user = profile;
      return asyncMiddlewareWrapper(socialAuthController.googleCallback)(req, res, next);
    })(req, res, next);
  });

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
