import { Request, Response } from 'express';
import fileService from '../services/file.service';
import serializeResponse from '../utils/serializeResponse';
import { mapTempFileToUploadFileDto } from '../mappers/file.mapTempFileToUploadFileDto.mapper';

export class FileController {
  async uploadFiles(req: Request, res: Response): Promise<Response> {
    const { files } = req;
    const newFiles = await fileService.uploadTempFiles(files!);
    return res
      .status(201)
      .json(serializeResponse({ responseData: { files: newFiles.map((file) => mapTempFileToUploadFileDto(file)) } }));
  }
}

const fileController = new FileController();
export default fileController;
