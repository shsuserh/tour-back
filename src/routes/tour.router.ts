import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import tourController from '../controllers/tour.controller';
import createFileUploadMiddleware from '../middlewares/fileUploadMiddleware';
import { ALLOWED_CES_IMAGE_MIME_TYPES, CES_MESSAGES } from '../constants/tour.constants';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';
import { storage } from '../config/multer';

const tourImageUpload = createFileUploadMiddleware(
  ALLOWED_CES_IMAGE_MIME_TYPES,
  CES_MESSAGES.allowedImageFormats,
  storage
);

function tourRouter(app: Application) {
  /**
   * @openapi
   * /tour:
   *  post:
   *     tags:
   *     - Tour
   *     description: Creates a TOUR entry with multilingual support and additional fields
   *     security:
   *     - authorization: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CesRequestDto'
   *     responses:
   *       200:
   *         description: TOUR entry created successfully
   * components:
   *   schemas:
   *     CesRequestDto:
   *       type: object
   *       required:
   *         - translations
   *         - categoryId
   *         - templateId
   *         - executionDate
   *         - authLevel
   *         - availabilityLevel
   *       properties:
   *         categoryId:
   *           type: string
   *           format: uuid
   *           description: The ID of the category
   *           example: "uuid"
   *         templateId:
   *           type: string
   *           format: uuid
   *           description: The ID of the template
   *           example: "uuid"
   *         authLevel:
   *           type: string
   *           enum: [basic_user, kyc_user, esem_user]
   *           description: The authorization level of the TOUR user
   *           example: "basic_user"
   *         availabilityLevel:
   *           type: integer
   *           enum: [1, 2, 3]
   *           description: The availability level of the TOUR service, 1 - individual, 2 - company, 3 - both
   *           example: 1
   *         imageId:
   *           type: string
   *           format: uuid
   *           description: Optional ID of the image associated with the TOUR entry
   *           example: "uuid"
   *         isActive:
   *           type: boolean
   *           description: Optional status to indicate if the entry is active
   *           example: true
   *         executionDate:
   *           type: string
   *           format: date-time
   *           description: Date of execution
   *           example: "2025-01-01T00:00:00Z"
   *         docsList:
   *           type: array
   *           description: A list of related documentation.
   *           items:
   *             type: object
   *             properties:
   *               isRequired:
   *                 type: boolean
   *                 description: Indicates if the item is required.
   *                 example: true
   *               am:
   *                 type: string
   *                 description: An Armenian translation (required).
   *                 example: "string"
   *               ru:
   *                 type: string
   *                 description: A Russian translation (optional).
   *                 example: "string"
   *               en:
   *                 type: string
   *                 description: An English translation (optional).
   *                 example: "string"
   *         translations:
   *           type: array
   *           description: List of translations for the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/CesTranslationDto'
   *         useFulLinks:
   *           type: array
   *           description: List of useful links associated with the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/UseFulLinksDto'
   *         useFulFiles:
   *           type: array
   *           description: List of useful files associated with the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/UseFulFileDto'
   *     CesTranslationDto:
   *       type: object
   *       required:
   *         - lgCode
   *         - field
   *         - value
   *       properties:
   *         lgCode:
   *           type: string
   *           description: Language code for translation
   *           example: "en"
   *         field:
   *           type: string
   *           description: Field name for the translation
   *           example: "title"
   *         value:
   *           type: string
   *           description: Translated text value
   *           example: "Translated text"
   *     UseFulLinksDto:
   *       type: object
   *       properties:
   *         link:
   *           type: string
   *           format: uri
   *           description: URL for the useful link
   *           example: "https://"
   *         am:
   *           type: string
   *           description: Armenian language link
   *           example: "string"
   *         en:
   *           type: string
   *           description: English language link
   *           example: "string"
   *         ru:
   *           type: string
   *           description: Russian language link
   *           example: "string"
   *     UseFulFileDto:
   *       type: object
   *       properties:
   *         fileId:
   *           type: string
   *           format: uuid
   *           description: ID of the useful file
   *           example: "uuid"
   *         am:
   *           type: string
   *           description: Armenian language description
   *           example: "string"
   *         en:
   *           type: string
   *           description: English language description
   *           example: "string"
   *         ru:
   *           type: string
   *           description: Russian language description
   *           example: "string"
   * /tour/{id}:
   *   put:
   *     tags:
   *     - Tour
   *     description: Updates a TOUR entry with multilingual support and additional fields
   *     security:
   *     - authorization: []
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *       description: The ID of the TOUR entry to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CesRequestDto'
   *     responses:
   *       200:
   *         description: TOUR entry updated successfully
   *       404:
   *         description: TOUR entry not found
   *       400:
   *         description: Invalid request data
   */
  app.post(
    '/tour',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.createTour)
  );

  /**
   * @openapi
   * /tour:
   *   get:
   *     summary: Get TOUR items
   *     description: Returns a list of TOUR items. Can be filtered by category ID and paginated.
   *     tags:
   *       - Tour
   *     security:
   *       - authorization: []
   *     parameters:
   *       - name: id
   *         in: query
   *         description: ID of the category to filter TOUR items by.
   *         required: false
   *         schema:
   *           type: string
   *       - name: page
   *         in: query
   *         description: The page number to retrieve.
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - name: limit
   *         in: query
   *         description: The number of items to retrieve per page.
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 20
   *     responses:
   *       200:
   *         description: Successfully retrieved TOUR items.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 responseData:
   *                   type: object
   *                   properties:
   *                     tourList:
   *                       type: array
   *                       items:
   *                         type: object
   *                         description: List of TOUR data
   *                     total:
   *                       type: integer
   *                       description: Total number of TOUR items
   */
  app.get(
    '/tour',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.getTourList)
  );

  /**
   * @openapi
   * /tour/{id}:
   *   get:
   *     tags:
   *     - Tour
   *     description: Retrieve a specific TOUR item by ID
   *     security:
   *     - authorization: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: The unique identifier of the TOUR item to retrieve
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Gets a specific TOUR by its ID
   *       404:
   *         description: TOUR not found
   */
  app.get(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.getTourById)
  );

  /**
   * @openapi
   * /tour/{id}:
   *  patch:
   *     tags:
   *     - Tour
   *     description: Updates the status of the tour
   *     security:
   *     - authorization: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the tour to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *              $ref: '#/components/schemas/CesStatusUpdateRequestDto'
   *     responses:
   *       200:
   *         description: Tour status updated successfully
   *       400:
   *         description: Invalid tour ID or request payload
   * components:
   *   schemas:
   *     CesStatusUpdateRequestDto:
   *       type: object
   *       required:
   *         - isActive
   *       properties:
   *         isActive:
   *           type: boolean
   *           description: Indicates whether the tour is active
   */
  app.patch(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.updateCesStatus)
  );

  /**
   * @openapi
   * /tour/{id}:
   *  delete:
   *     tags:
   *     - Tour
   *     description: Deletes the specified tour
   *     security:
   *     - authorization: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the tour to delete
   *
   *     responses:
   *       200:
   *         description: Tour deleted successfully
   *       404:
   *         description: Invalid tour ID
   */
  app.delete(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.deleteCes)
  );

  /**
   * @openapi
   * /tour/image:
   *   post:
   *     tags:
   *       - Tour
   *     description: Endpoint to upload a single file.
   *     security:
   *     - authorization: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The single file to upload
   *             required:
   *               - file
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 files:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         description: The name of the uploaded file
   *                       id:
   *                         type: string
   *                         description: The id of the uploaded file
   */
  app.post(
    '/tour/image',
    tourImageUpload.single('file'),
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.uploadFile)
  );

  /**
   * @openapi
   * /tour/{id}:
   *   put:
   *     tags:
   *       - Tour
   *     description: Updates a TOUR entry with multilingual support and additional fields
   *     security:
   *       - authorization: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the TOUR entry to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CesRequestDto'
   *     responses:
   *       200:
   *         description: TOUR entry updated successfully
   *       404:
   *         description: TOUR entry not found
   *       400:
   *         description: Invalid request data
   */

  /**
   * @openapi
   * components:
   *   schemas:
   *     CesRequestDto:
   *       type: object
   *       required:
   *         - translations
   *         - categoryId
   *         - templateId
   *         - executionDate
   *       properties:
   *         categoryId:
   *           type: string
   *           format: uuid
   *           description: The ID of the category
   *           example: "uuid"
   *         templateId:
   *           type: string
   *           format: uuid
   *           description: The ID of the template
   *           example: "uuid"
   *         imageId:
   *           type: string
   *           format: uuid
   *           description: Optional ID of the image associated with the TOUR entry
   *           example: "uuid"
   *         isActive:
   *           type: boolean
   *           description: Optional status to indicate if the entry is active
   *           example: true
   *         executionDate:
   *           type: string
   *           format: date-time
   *           description: Date of execution
   *           example: "2024-05-01T10:00:00Z"
   *         docsList:
   *           type: array
   *           description: A list of related documentation.
   *           items:
   *             type: object
   *             properties:
   *               isRequired:
   *                 type: boolean
   *                 description: Indicates if the item is required.
   *                 example: false
   *               am:
   *                 type: string
   *                 description: An Armenian translation (required).
   *                 example: "string"
   *               ru:
   *                 type: string
   *                 description: A Russian translation (optional).
   *                 example: "string"
   *               en:
   *                 type: string
   *                 description: An English translation (optional).
   *                 example: "string"
   *         translations:
   *           type: array
   *           description: List of translations for the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/CesTranslationDto'
   *         useFulLinks:
   *           type: array
   *           description: List of useful links associated with the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/UseFulLinksDto'
   *         useFulFiles:
   *           type: array
   *           description: List of useful files associated with the TOUR entry
   *           items:
   *             $ref: '#/components/schemas/UseFulFileDto'
   *     CesTranslationDto:
   *       type: object
   *       required:
   *         - lgCode
   *         - field
   *         - value
   *       properties:
   *         lgCode:
   *           type: string
   *           description: Language code for translation
   *           example: "am"
   *         field:
   *           type: string
   *           description: Field name for the translation
   *           example: "name"
   *         value:
   *           type: string
   *           description: Translated text value
   *           example: "Translated text"
   *     UseFulLinksDto:
   *       type: object
   *       properties:
   *         link:
   *           type: string
   *           format: uri
   *           description: URL for the useful link
   *           example: "https://example.com"
   *         am:
   *           type: string
   *           description: Armenian language link
   *           example: "string"
   *         en:
   *           type: string
   *           description: English language link
   *           example: "string"
   *         ru:
   *           type: string
   *           description: Russian language link
   *           example: "string"
   *     UseFulFileDto:
   *       type: object
   *       properties:
   *         fileId:
   *           type: string
   *           format: uuid
   *           description: ID of the useful file
   *           example: "uuid"
   *         am:
   *           type: string
   *           description: Armenian language description
   *           example: "string"
   *         en:
   *           type: string
   *           description: English language description
   *           example: "string"
   *         ru:
   *           type: string
   *           description: Russian language description
   *           example: "string"
   */
  app.put(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.updateTour)
  );

  /**
   * @openapi
   * /v1/tour/info/{id}:
   *   get:
   *     summary: Get TOUR Info by ID
   *     description: Retrieves detailed information about a specific TOUR (Central Execution System) entity by its unique ID.
   *     security:
   *       - authorization: []
   *     tags:
   *       - Tour
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The unique identifier for the TOUR entity.
   *         schema:
   *           type: string
   *       - name: lgcode
   *         in: header
   *         required: true
   *         description: The language code for the response.
   *         schema:
   *           type: string
   *           example: "en"
   *     responses:
   *       200:
   *         description: Successful response with TOUR details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Unique ID of the TOUR entity.
   *                   example: "abc123"
   *                 createDate:
   *                   type: string
   *                   format: date-time
   *                   description: The date when the TOUR entity was created.
   *                   example: "2023-11-22T14:12:00Z"
   *                 name:
   *                   type: string
   *                   description: The name of the TOUR entity.
   *                   example: "TOUR Example"
   *                 executionDate:
   *                   type: string
   *                   format: date-time
   *                   description: The date when the TOUR execution is scheduled.
   *                   example: "2023-12-01T09:00:00Z"
   *                 docsList:
   *                   type: array
   *                   description: A list of related documentation.
   *                   items:
   *                     type: object
   *                     properties:
   *                       isRequired:
   *                         type: boolean
   *                         description: Indicates if the item is required.
   *                         example: true
   *                       title:
   *                         type: string
   *                         description: The name of the required document.
   *                         example: "Document Title"
   *                 path:
   *                   type: array
   *                   description: A sequence of path entries associated with the TOUR.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the path entry.
   *                         example: "path123"
   *                       name:
   *                         type: string
   *                         description: Descriptive name of the path entry.
   *                         example: "Main Route"
   *                 image:
   *                   type: object
   *                   description: Optional image file associated with the TOUR.
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: Unique ID of the image file.
   *                       example: "file123"
   *                     name:
   *                       type: string
   *                       description: Name of the image file.
   *                       example: "example-image.png"
   *                     originalName:
   *                       type: string
   *                       description: Original file name.
   *                       example: "image-original.png"
   *                     mimeType:
   *                       type: string
   *                       description: MIME type of the file.
   *                       example: "image/png"
   *                     extension:
   *                       type: string
   *                       description: File extension.
   *                       example: "png"
   *                     size:
   *                       type: number
   *                       description: Size of the file in bytes.
   *                       example: 123456
   *                     filePath:
   *                       type: string
   *                       description: File path where the file is stored.
   *                       example: "/uploads/images/example-image.png"
   *                 useFulLinks:
   *                   type: array
   *                   description: List of useful links associated with the TOUR.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the link.
   *                         example: "link123"
   *                       link:
   *                         type: string
   *                         description: The URL of the link.
   *                         example: "https://example.com"
   *                       name:
   *                         type: string
   *                         description: A descriptive name for the link.
   *                         example: "TOUR Documentation"
   *                 useFulFiles:
   *                   type: array
   *                   description: List of useful files associated with the TOUR.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the file.
   *                         example: "file123"
   *                       name:
   *                         type: string
   *                         description: Name of the file.
   *                         example: "example-file.pdf"
   *                       cesFile:
   *                         type: object
   *                         description: Detailed file information.
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Unique ID of the file.
   *                             example: "file123"
   *                           name:
   *                             type: string
   *                             description: Name of the file.
   *                             example: "example-file.pdf"
   *                           originalName:
   *                             type: string
   *                             description: Original file name.
   *                             example: "file-original.pdf"
   *                           mimeType:
   *                             type: string
   *                             description: MIME type of the file.
   *                             example: "application/pdf"
   *                           extension:
   *                             type: string
   *                             description: File extension.
   *                             example: "pdf"
   *                           size:
   *                             type: number
   *                             description: Size of the file in bytes.
   *                             example: 98765
   *                           filePath:
   *                             type: string
   *                             description: File path where the file is stored.
   *                             example: "/uploads/files/example-file.pdf"
   *       400:
   *         description: Invalid request. Missing or invalid parameters.
   *       404:
   *         description: TOUR entity not found.
   *       500:
   *         description: Internal server error.
   */
  app.get('/v1/tour/info/:id', asyncMiddlewareWrapper(tourController.getTourInfo));
}
export default tourRouter;
