import { validate, ValidationError } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { AppError } from '../errors';
import { TranslationDto } from '../datatypes/dtos/request/common.dto';
import i18n from 'i18n';

export const validateDto = async (dtoClass) => {
  const errors = await validate(dtoClass, {
    whitelist: true,
    forbidNonWhitelisted: false,
    stopAtFirstError: true,
  });

  const formatArrayToObj = (inputArray: object[]) => {
    const transformedObject = inputArray.reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      acc[key] = curr[key];
      return acc;
    }, {});

    return transformedObject;
  };

  function isTranslationDto(obj): obj is TranslationDto {
    return obj && typeof obj === 'object' && 'field' in obj;
  }

  function formatNestedErrors(errors: ValidationError[]) {
    const result = {};
    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        if (error.children[0].target && isTranslationDto(error.children[0].target)) {
          const field = error.children[0].target.field;
          const lgCode = error.value?.lgCode;

          if (lgCode && field) {
            if (!result[lgCode]) {
              result[lgCode] = {};
            }

            const nested = formatArrayToObj(error.children.map((childError) => formatNestedErrors([childError])));

            if (!result[lgCode][field]) {
              result[lgCode][field] = [];
            }
            result[lgCode][field].push(...Object.values(nested).flat());
          }
        } else {
          if (error.value instanceof TranslationDto) {
            result[error.value.lgCode] = formatArrayToObj(
              error.children.map((childError) => formatNestedErrors([childError]))
            );
          } else {
            const isArrayOfObjects = Array.isArray(error.value);
            const childErrors = error.children;

            if (isArrayOfObjects && typeof error.property === 'string' && error.property !== 'translations') {
              const indexedErrors = {};

              childErrors.forEach((childError, index) => {
                const formatted = formatNestedErrors([childError]);

                const keys = Object.keys(formatted);
                if (
                  keys.length === 1 &&
                  /^\d+$/.test(keys[0]) &&
                  typeof formatted[keys[0]] === 'object' &&
                  formatted[keys[0]] !== null &&
                  !Array.isArray(formatted[keys[0]])
                ) {
                  indexedErrors[childError.property] = formatted[keys[0]];
                } else {
                  indexedErrors[index] = formatted;
                }
              });

              result[error.property] = indexedErrors;
            } else {
              const merged = {};
              const flatMapped = childErrors.flatMap((childError) => formatNestedErrors([childError]));
              flatMapped.forEach((group) => {
                const typedGroup = group as Record<string, unknown>;

                const entriesToProcess: Record<string, unknown>[] = [];

                const allKeysAreNumeric = Object.keys(typedGroup).every((key) => !isNaN(Number(key)));

                if (allKeysAreNumeric) {
                  for (const value of Object.values(typedGroup)) {
                    if (typeof value === 'object' && value !== null) {
                      entriesToProcess.push(value as Record<string, unknown>);
                    }
                  }
                } else {
                  entriesToProcess.push(typedGroup);
                }
                entriesToProcess.forEach((entry) => {
                  for (const [outerKey, maybeNested] of Object.entries(entry)) {
                    if (Array.isArray(maybeNested)) {
                      if (!merged[outerKey]) {
                        merged[outerKey] = [];
                      }
                      merged[outerKey].push(...maybeNested);
                    } else if (typeof maybeNested === 'object' && maybeNested !== null) {
                      if (!merged[outerKey]) {
                        merged[outerKey] = {};
                      }

                      for (const [innerKey, messages] of Object.entries(maybeNested)) {
                        if (!Array.isArray(messages)) continue;

                        if (!merged[outerKey][innerKey]) {
                          merged[outerKey][innerKey] = [];
                        }

                        merged[outerKey][innerKey].push(...messages);
                      }
                    }
                  }
                });
              });
              result[error.property] = merged;
            }
          }
        }
      } else if (error.constraints) {
        for (const key in error.constraints) {
          error.constraints[key] = i18n.__(error.constraints[key]);
        }
        result[error.property] = Object.values(error.constraints);
      }
    });

    return result;
  }

  if (errors.length > 0) {
    throw new AppError({
      code: 400,
      toaster: false,
      errors: formatNestedErrors(errors),
    });
  }
};

export async function validateAndExtractDto<T>(dtoClass: ClassConstructor<T>, data: unknown): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, data);
  await validateDto(dtoInstance);
  return dtoInstance;
}
