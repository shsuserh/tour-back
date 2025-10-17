import { CommonResponse, CommonResponseData } from '../interfaces/commonResponse';

const serializeResponse = (response: CommonResponseData): CommonResponse => {
  const { toaster, msg, toasterSuccess, responseData } = response;
  return {
    data: {
      success: true,
      toaster,
      msg,
      toasterSuccess,
      ...responseData,
    },
  };
};

export default serializeResponse;
