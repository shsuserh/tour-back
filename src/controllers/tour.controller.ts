import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateAndExtractDto, validateDto } from '../utils/validationErrorHandler';
import { TourRequestDto, TourStatusUpdateRequestDto } from '../datatypes/dtos/request/tour.request.dto';
import { TOUR_MESSAGES } from '../constants/tour.constants';
import { IdDto, PaginationDto } from '../datatypes/dtos/request/common.dto';
import serializeResponse from '../utils/serializeResponse';
import tourService from '../services/tour.service';
import fileController from './file.controller';
import { AppError, ERROR_TYPES } from '../errors';
import { mapTourToTourDto } from '../mappers/tour.mapTourToTourDto.mapper';

// Base for image URLs. The site's SSR server calls this API on an internal address (e.g. http://back:3030),
// so the request host can't be used in URLs that end up in public HTML; PUBLIC_URL sets the real one.
const publicBaseUrl = (req: Request) =>
  process.env.PUBLIC_URL?.replace(/\/$/, '') || `${req.protocol}://${req.get('host')}`;

export class TourController {
  async createTour(req: Request, res: Response): Promise<Response> {
    const touRequestDto = plainToInstance(TourRequestDto, req.body);
    await validateDto(touRequestDto);
    await tourService.processTourCreation(touRequestDto);

    return res.status(200).json(
      serializeResponse({
        toaster: true,
        toasterSuccess: [TOUR_MESSAGES.successCreate],
        msg: TOUR_MESSAGES.successCreate,
      })
    );
  }

  async uploadFile(req: Request, res: Response): Promise<Response> {
    req.files = [req.file!];
    return fileController.uploadFiles(req, res);
  }

  async uploadUsefulFiles(req: Request, res: Response): Promise<Response> {
    req.files = [req.file!];
    return fileController.uploadFiles(req, res);
  }

  async getTourList(req: Request, res: Response): Promise<Response> {
    const { page, limit } = req.query;
    const paginationDto = await validateAndExtractDto(PaginationDto, { page, limit });
    const { tourList, total } = await tourService.getTourList(paginationDto);

    return res.status(200).json(
      serializeResponse({
        responseData: {
          tourList: tourList,
          total,
        },
      })
    );
  }

  async getTourById(req: Request, res: Response): Promise<Response> {
    const paramsDto = await validateAndExtractDto(IdDto, req.params);
    const { id } = paramsDto;
    const tour = await tourService.getById(id);

    if (tour) {
      return res.status(200).json(serializeResponse({ responseData: tour }));
    } else {
      throw new AppError({
        code: ERROR_TYPES.notFoundError,
        toaster: true,
        errors: [TOUR_MESSAGES.notFoundErrorMessage],
      });
    }
  }

  async updateTour(req: Request, res: Response): Promise<Response> {
    const idDto = await validateAndExtractDto(IdDto, req.params);
    const tourUpdateDto = await validateAndExtractDto(TourRequestDto, req.body);

    await tourService.processTourUpdate(idDto.id, tourUpdateDto);

    return res.status(200).json(
      serializeResponse({
        toaster: true,
        msg: TOUR_MESSAGES.statusUpdateSuccessMessage,
        toasterSuccess: [TOUR_MESSAGES.statusUpdateSuccessMessage],
      })
    );
  }

  async updateTourStatus(req: Request, res: Response): Promise<Response> {
    const cesUpdateStatusDto = await validateAndExtractDto(TourStatusUpdateRequestDto, req.body);
    const paramsDto = await validateAndExtractDto(IdDto, req.params);
    const { isActive } = cesUpdateStatusDto;
    const { id } = paramsDto;

    await tourService.updateTourStatus(id, isActive);

    return res.status(200).json(
      serializeResponse({
        toaster: true,
        msg: TOUR_MESSAGES.statusUpdateSuccessMessage,
        toasterSuccess: [TOUR_MESSAGES.statusUpdateSuccessMessage],
      })
    );
  }

  async deleteTour(req: Request, res: Response) {
    const tourDeleteDto = plainToInstance(IdDto, req.params);
    await validateDto(tourDeleteDto);
    await tourService.deleteTour(tourDeleteDto.id);

    return res
      .status(200)
      .json(serializeResponse({ toaster: true, toasterSuccess: [TOUR_MESSAGES.deleteSuccessMessage] }));
  }

  // Public site endpoints: plain JSON in the shape of tour-react/src/data/mockData.js
  async getPublicTours(req: Request, res: Response): Promise<Response> {
    const tours = await tourService.getActiveTours();
    const baseUrl = publicBaseUrl(req);
    return res.status(200).json(tours.map((tour) => mapTourToTourDto(tour, baseUrl)));
  }

  async getPublicTourBySlug(req: Request, res: Response): Promise<Response> {
    const tour = await tourService.getActiveTourBySlug(String(req.params.slug));
    return res.status(200).json(mapTourToTourDto(tour, publicBaseUrl(req)));
  }
}

const tourController = new TourController();
export default tourController;
