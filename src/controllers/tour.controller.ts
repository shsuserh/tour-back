import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateAndExtractDto, validateDto } from '../utils/validationErrorHandler';
import { TourRequestDto, CesStatusUpdateRequestDto } from '../datatypes/dtos/request/tour.request.dto';
import { CES_MESSAGES } from '../constants/tour.constants';
import { IdDto, LanguageCodeDto, PaginationDto } from '../datatypes/dtos/request/common.dto';
import serializeResponse from '../utils/serializeResponse';
import tourService from '../services/tour.service';
import fileController from './file.controller';
import { AppError, ERROR_TYPES } from '../errors';

export class TourController {
  async createTour(req: Request, res: Response): Promise<Response> {
    const touRequestDto = plainToInstance(TourRequestDto, req.body);
    await validateDto(touRequestDto);
    await tourService.processCesCreation(touRequestDto);

    return res.status(200).json(
      serializeResponse({
        toaster: true,
        toasterSuccess: [CES_MESSAGES.successCreate],
        msg: CES_MESSAGES.successCreate,
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
        errors: [CES_MESSAGES.notFoundErrorMessage],
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
        msg: CES_MESSAGES.statusUpdateSuccessMessage,
        toasterSuccess: [CES_MESSAGES.statusUpdateSuccessMessage],
      })
    );
  }

  async updateCesStatus(req: Request, res: Response): Promise<Response> {
    const cesUpdateStatusDto = await validateAndExtractDto(CesStatusUpdateRequestDto, req.body);
    const paramsDto = await validateAndExtractDto(IdDto, req.params);
    const { isActive } = cesUpdateStatusDto;
    const { id } = paramsDto;

    await tourService.updateCesStatus(id, isActive);

    return res.status(200).json(
      serializeResponse({
        toaster: true,
        msg: CES_MESSAGES.statusUpdateSuccessMessage,
        toasterSuccess: [CES_MESSAGES.statusUpdateSuccessMessage],
      })
    );
  }

  async deleteCes(req: Request, res: Response) {
    const cesDeleteDto = plainToInstance(IdDto, req.params);
    await validateDto(cesDeleteDto);
    await tourService.deleteCes(cesDeleteDto.id);

    return res
      .status(200)
      .json(serializeResponse({ toaster: true, toasterSuccess: [CES_MESSAGES.deleteSuccessMessage] }));
  }

  async getTourInfo(req: Request, res: Response): Promise<Response> {
    const { lgcode: lgCode } = req.headers;
    const languageCodeDto = await validateAndExtractDto(LanguageCodeDto, { lgCode });
    const paramsDto = await validateAndExtractDto(IdDto, req.params);
    const { id } = paramsDto;
    const { tour } = await tourService.getTourInfo(id, languageCodeDto.lgCode);

    return res.status(200).json(serializeResponse({ responseData: { tourInfo: tour } }));
  }
}

const cesController = new TourController();
export default cesController;
