import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { TranslationFields } from '../datatypes/enums/enums';

@ValidatorConstraint()
export class ValidateCategoryTranslationValue implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    if (validationArguments.object['field'] === TranslationFields.NAME) {
      return Boolean(value);
    } else {
      return true;
    }
  }
}
