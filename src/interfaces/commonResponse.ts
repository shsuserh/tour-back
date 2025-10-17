export interface CommonResponseData {
  toaster?: boolean;
  msg?: string;
  toasterSuccess?: string[];
  responseData?: any;
}
export interface CommonResponse {
  data: CommonResponseData;
}
