import { Request } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FILE_UPLOAD_FOLDER, PRIVATE_FILE_UPLOAD_FOLDER } from '../constants/common.constants';

export const storage = multer.diskStorage({
  destination: `.${FILE_UPLOAD_FOLDER}`,
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, (file.filename = uuidv4().concat('.').concat(file.originalname.split('.')[1])));
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  },
});

export const privateStorage = multer.diskStorage({
  destination: `.${PRIVATE_FILE_UPLOAD_FOLDER}`,
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, (file.filename = uuidv4().concat('.').concat(file.originalname.split('.')[1])));

    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  },
});
