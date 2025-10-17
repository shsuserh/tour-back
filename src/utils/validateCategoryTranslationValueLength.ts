import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { TranslationFields } from '../datatypes/enums/enums';
@ValidatorConstraint()
export class ValidateCategoryTranslationValueLength implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const trimmed = value.trim();
    const field = args.object['field'];

    if (field === TranslationFields.DESCRIPTION) {
      return trimmed === '' ? value === '' : trimmed.length <= 2000;
    }

    return trimmed.length >= 3 && trimmed.length <= 250;
  }
}
