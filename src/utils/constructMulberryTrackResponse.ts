import _ from 'lodash';
import { LanguageCode } from '../datatypes/enums/enums';
import { MulberryTrackResponse, TrackApplication, FileInfo } from '../datatypes/internal/mulberry.internal';
import { MULBERRY_TRACK_STATUS_TYPES } from '../constants/mulberry.constants';

export function constructMulberryTrackResponse(
  response: MulberryTrackResponse,
  lgCode = LanguageCode.AM
): TrackApplication {
  const { result } = response;

  let info: FileInfo[] = [];
  let archiveB64;

  if (result.status.name === MULBERRY_TRACK_STATUS_TYPES.finished) {
    if (!_.isEmpty(result['related'])) {
      info = result['related'].files?.info;
      archiveB64 = result['related'].files?.archive;
    } else {
      archiveB64 = result.files?.archive;
      info = result.files?.info || [];
    }
  }

  return {
    statusName: result.status.name,
    statusTitle: result.status.title,
    isFinished: result.is_finished,
    applicationNumber: _.isString(result.data.sys_reg_num) ? result.data.sys_reg_num : result.data.sys_reg_num[lgCode],
    cesName: result.data.sys_title[lgCode],
    completionDate: result['deadline'] || '',
    files: info,
    archive: archiveB64,
  };
}
