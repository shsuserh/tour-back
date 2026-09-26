import { Application } from 'express';
import asyncMiddlewareWrapper from '../middlewares/asyncMiddlewareWrapper';
import tourController from '../controllers/tour.controller';
import createFileUploadMiddleware from '../middlewares/fileUploadMiddleware';
import { ALLOWED_TOUR_IMAGE_MIME_TYPES, TOUR_MESSAGES } from '../constants/tour.constants';
import requireToBeAuthenticated from '../middlewares/requireToBeAuthenticated';
import { storage } from '../config/multer';

const tourImageUpload = createFileUploadMiddleware(
  ALLOWED_TOUR_IMAGE_MIME_TYPES,
  TOUR_MESSAGES.allowedImageFormats,
  storage
);

function tourRouter(app: Application) {
  /**
   * @openapi
   * components:
   *   schemas:
   *     TourRequestDto:
   *       type: object
   *       required: [slug, type, region, price, maxGroup, languages, translations]
   *       description: Exactly one of durationHours / durationDays is required.
   *       properties:
   *         isActive: { type: boolean, example: true }
   *         slug: { type: string, example: "garni-geghard" }
   *         type: { type: string, enum: [day, city, multi, abroad], example: "day" }
   *         region: { type: string, description: "Region key used for filtering", example: "kotayk" }
   *         durationHours: { type: integer, example: 6 }
   *         durationDays: { type: integer, example: 7 }
   *         price: { type: number, description: "USD per person", example: 45 }
   *         privatePrice: { type: number, description: "USD per group, optional", example: 110 }
   *         privateOnly: { type: boolean, example: false }
   *         maxGroup: { type: integer, example: 15 }
   *         languages: { type: array, items: { type: string, enum: [am, en, ru] }, example: [am, en, ru] }
   *         popular: { type: boolean, example: true }
   *         imageIds:
   *           type: array
   *           description: Ordered gallery (uploaded via POST /tour/image); the first one is the cover
   *           items: { type: string, format: uuid }
   *         itinerary:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               time: { type: string, example: "10:00" }
   *               title: { $ref: '#/components/schemas/LanguageTexts' }
   *               text: { $ref: '#/components/schemas/LanguageTexts' }
   *         translations:
   *           type: array
   *           description: "title is required in am, en and ru. highlights, included and excluded take a string array."
   *           items: { $ref: '#/components/schemas/TourTranslationDto' }
   *     TourTranslationDto:
   *       type: object
   *       required: [lgCode, field, value]
   *       properties:
   *         lgCode: { type: string, enum: [am, en, ru], example: "en" }
   *         field:
   *           type: string
   *           enum: [title, region, overview, meeting, goodToKnow, highlights, included, excluded]
   *           example: "title"
   *         value:
   *           oneOf:
   *             - { type: string }
   *             - { type: array, items: { type: string } }
   *           example: "Garni Temple & Geghard Monastery"
   *     LanguageTexts:
   *       type: object
   *       required: [en]
   *       properties:
   *         am: { type: string }
   *         en: { type: string }
   *         ru: { type: string }
   * /tour:
   *   post:
   *     tags: [Tour]
   *     description: Creates a tour
   *     security:
   *     - authorization: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/TourRequestDto' }
   *     responses:
   *       200: { description: Tour created }
   *       400: { description: Invalid request data or slug already taken }
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
   *     tags: [Tour]
   *     summary: Get tours (admin, paginated)
   *     security:
   *       - authorization: []
   *     parameters:
   *       - { name: page, in: query, required: false, schema: { type: integer, minimum: 1, default: 1 } }
   *       - { name: limit, in: query, required: false, schema: { type: integer, minimum: 1, default: 20 } }
   *     responses:
   *       200: { description: "responseData: { tourList, total }" }
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
   *     tags: [Tour]
   *     description: Get a tour by ID (admin)
   *     security:
   *     - authorization: []
   *     parameters:
   *       - { name: id, in: path, required: true, schema: { type: string } }
   *     responses:
   *       200: { description: The tour }
   *       404: { description: Tour not found }
   */
  app.get(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.getTourById)
  );

  /**
   * @openapi
   * /tour/{id}:
   *   patch:
   *     tags: [Tour]
   *     description: Updates the status of the tour
   *     security:
   *     - authorization: []
   *     parameters:
   *       - { name: id, in: path, required: true, schema: { type: string } }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [isActive]
   *             properties:
   *               isActive: { type: boolean }
   *     responses:
   *       200: { description: Tour status updated }
   *       400: { description: Invalid tour ID or request payload }
   */
  app.patch(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.updateTourStatus)
  );

  /**
   * @openapi
   * /tour/{id}:
   *   delete:
   *     tags: [Tour]
   *     description: Deletes the tour and its images
   *     security:
   *     - authorization: []
   *     parameters:
   *       - { name: id, in: path, required: true, schema: { type: string } }
   *     responses:
   *       200: { description: Tour deleted }
   *       404: { description: Tour not found }
   */
  app.delete(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.deleteTour)
  );

  /**
   * @openapi
   * /tour/image:
   *   post:
   *     tags: [Tour]
   *     description: Uploads one tour image; pass the returned id in imageIds.
   *     security:
   *     - authorization: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [file]
   *             properties:
   *               file: { type: string, format: binary }
   *     responses:
   *       200: { description: "files: [{ id, name }]" }
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
   *     tags: [Tour]
   *     description: Updates a tour. Omit imageIds to leave the gallery unchanged.
   *     security:
   *       - authorization: []
   *     parameters:
   *       - { name: id, in: path, required: true, schema: { type: string } }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/TourRequestDto' }
   *     responses:
   *       200: { description: Tour updated }
   *       404: { description: Tour not found }
   *       400: { description: Invalid request data or slug already taken }
   */
  app.put(
    '/tour/:id',
    asyncMiddlewareWrapper(requireToBeAuthenticated),
    asyncMiddlewareWrapper(tourController.updateTour)
  );

  /**
   * @openapi
   * /tours:
   *   get:
   *     tags: [Tour]
   *     summary: Active tours for the public site (shape of tour-react mockData.js)
   *     responses:
   *       200: { description: Tour[] }
   * /tours/{slug}:
   *   get:
   *     tags: [Tour]
   *     summary: One active tour for the public site
   *     parameters:
   *       - { name: slug, in: path, required: true, schema: { type: string } }
   *     responses:
   *       200: { description: Tour }
   *       404: { description: Tour not found or inactive }
   */
  app.get('/tours', asyncMiddlewareWrapper(tourController.getPublicTours));
  app.get('/tours/:slug', asyncMiddlewareWrapper(tourController.getPublicTourBySlug));
}
export default tourRouter;
