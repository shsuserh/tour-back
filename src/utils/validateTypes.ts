import { AppError, ERROR_TYPES } from '../errors';

export function validateStringValueType(value: unknown, key: string): void {
  if (typeof value !== 'string') {
    throw new AppError({
      code: ERROR_TYPES.badRequestError,
      errors: [`Invalid value for key "${key}". Expected a string.`],
    });
  }
}

export function validateArrayValueType(value: unknown, key: string): void {
  if (!Array.isArray(value)) {
    throw new AppError({
      code: ERROR_TYPES.badRequestError,
      errors: [`Invalid value for key "${key}". Expected an array.`],
    });
  }
}

export function validateTextTagValueLength(value: unknown, key: string): void {
  if ((value as string).length > 1000) {
    throw new AppError({
      code: ERROR_TYPES.badRequestError,
      errors: [`Invalid value length for key "${key}". Expected a less than 1000 characters.`],
    });
  }
}

export function validateInputTagValueLength(value: unknown, key: string): void {
  if ((value as string).length > 250) {
    throw new AppError({
      code: ERROR_TYPES.badRequestError,
      errors: [`Invalid value length for key "${key}". Expected a less than 250 characters.`],
    });
  }
}
