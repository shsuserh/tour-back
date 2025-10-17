import * as _ from 'lodash';
import { CronJob } from 'cron';
import path from 'path';
import fs from 'fs';
import tempFileRepository from '../repositories/tempFile.repository';
import { COMMON_ERROR_MESSAGES, FILE_UPLOAD_FOLDER, NUMBER_OF_DAYS_SINCE_NOW } from '../constants/common.constants';

const uploadDir = path.join(process.cwd(), `${FILE_UPLOAD_FOLDER}`);
const job = new CronJob(
  '0 0 0 * * 0',
  async function () {
    try {
      const dateNow = new Date(Date.now());

      const tempFiles = await tempFileRepository.getFilesByDate(dateNow, NUMBER_OF_DAYS_SINCE_NOW);

      if (!tempFiles.length) return;
      const fileNames = fs.readdirSync(uploadDir);

      const invalidFiles = _.difference(tempFiles.map((file) => file.name, fileNames));

      if (!invalidFiles.length) return;

      for (const file of invalidFiles) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
      await tempFileRepository.deleteTempFilesByNames(invalidFiles);
    } catch (err) {
      console.log(`Error: ${COMMON_ERROR_MESSAGES.cronJobError}`, err);
    }
  },
  null,
  false,
  'Asia/Yerevan'
);

export default job;
