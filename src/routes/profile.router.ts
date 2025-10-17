import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';
import profileController from '../controllers/profile.controller';

function profileRouter(app: Application) {
  /**
   * @openapi
   * /profile:
   *   get:
   *     summary: Get current user's profile
   *     description: Returns profile information for the currently authenticated user.
   *     tags:
   *       - Profile
   *     security:
   *       - authorization: []
   *     responses:
   *       200:
   *         description: Successfully retrieved user profile
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "user_123"
   *                     name:
   *                       type: string
   *                       example: "Ani"
   *                     lastname:
   *                       type: string
   *                       example: "Gevorgyan"
   *                     role:
   *                       type: string
   *                       example: "admin"
   *       401:
   *         description: Unauthorized – missing or invalid authentication token
   *       500:
   *         description: Internal server error
   */
  app.get(
    '/profile',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(profileController.getUserProfile)
  );
}

export default profileRouter;
