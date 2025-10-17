import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import userController from '../controllers/user.controller';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';
import requireToBeSuperAdmin from '../middlewares/requireToBeSuperAdmin';

function userRouter(app: Application) {
  /**
   * @openapi
   * /user:
   *  get:
   *     tags:
   *     - User
   *     description: Fetches a list of all users. Accessible only by admins.
   *     security:
   *     - authorization: []
   *     responses:
   *       200:
   *         description: A list of users.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/UserResponse'
   *       403:
   *         description: Forbidden. Only admins can access this endpoint.
   *       500:
   *         description: Internal server error.
   * components:
   *   schemas:
   *     UserResponse:
   *       type: object
   *       required:
   *         - id
   *         - created
   *         - updated
   *         - yid
   *         - username
   *         - phone
   *         - uid
   *         - name
   *         - lastname
   *         - role
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *           description: The unique identifier of the user.
   *         created:
   *           type: string
   *           format: date-time
   *           description: The timestamp of when the user was created.
   *         updated:
   *           type: string
   *           format: date-time
   *           description: The timestamp of the last update to the user's data.
   *         yid:
   *           type: string
   *           description: The unique YID of the user.
   *         username:
   *           type: string
   *           description: The username of the user.
   *         email:
   *           type: string
   *           nullable: true
   *           description: The email of the user, if available.
   *         phone:
   *           type: string
   *           description: The phone number of the user.
   *         uid:
   *           type: string
   *           description: The unique UID of the user.
   *         name:
   *           type: string
   *           description: The first name of the user.
   *         lastname:
   *           type: string
   *           description: The last name of the user.
   *         ssn:
   *           type: string
   *           description: The social security number of the user.
   *         status:
   *           type: integer
   *           description: The status of the user.
   *           example: 2
   *         gender:
   *           type: integer
   *           description: The gender of the user.
   *           example: 2
   *         image:
   *           type: string
   *           description: The file path to the user's profile image.
   *         role:
   *           type: string
   *           description: The role of the user.
   *           enum:
   *             - admin
   *             - user
   */

  /**
   * @openapi
   * /user:
   *   post:
   *     tags:
   *     - User
   *     description: Adds a new user to the system.
   *     security:
   *     - authorization: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequestDto'
   *     responses:
   *       201:
   *         description: User created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized. Authentication is required.
   *       403:
   *         description: Forbidden. Only super admins can access this endpoint.
   *       400:
   *         description: Bad request. Invalid input.
   *       500:
   *         description: Internal server error.
   * components:
   *   schemas:
   *     CreateUserRequestDto:
   *       type: object
   *       required:
   *         - username
   *         - password
   *         - confirmPassword
   *       properties:
   *         username:
   *           type: string
   *           description: The unique identifier for the user.
   *         password:
   *           type: string
   *           description: The password of the user.
   *         confirmPassword:
   *           type: string
   *           description: The password of the user.
   *     UserResponse:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: The unique identifier for the user.
   *         yid:
   *           type: string
   *           description: The unique identifier for the user.
   *         role:
   *           type: string
   *           description: The role of the user.
   *           enum:
   *             - admin
   *             - user
   */

  app.post('/user', asyncMiddlewareWrapper(userController.addUser));

  /**
   * @openapi
   * /user/{id}:
   *   delete:
   *     tags:
   *       - User
   *     description: Deletes a user by ID. Only accessible by super admins. Super admins cannot delete themselves.
   *     security:
   *       - authorization: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the user to delete.
   *     responses:
   *       200:
   *         description: User successfully deleted.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User deleted successfully.
   *       403:
   *         description: Forbidden. You cannot delete yourself or you do not have permission.
   *       404:
   *         description: User not found.
   *       500:
   *         description: Internal server error.
   */
  app.delete(
    '/user/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(requireToBeSuperAdmin),
    asyncMiddlewareWrapper(userController.removeUser)
  );
}

export default userRouter;
