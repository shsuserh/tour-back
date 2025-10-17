import ErrorData from './errorData';

class AppError extends Error {
  code: number;
  errors?: object;
  toaster?: boolean;
  toasterErrors?: string[];

  constructor(errorData: ErrorData) {
    super();

    this.code = errorData.code;
    this.errors = errorData.errors;
    this.toaster = errorData.toaster;
    this.toasterErrors = errorData.toasterErrors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default AppError;
