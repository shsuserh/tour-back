/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LanguageCode, TranslationFields } from '../datatypes/enums/enums';

@ValidatorConstraint({ name: 'IsCodeValid' })
export class IsCodeValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const requiredLanguages = [LanguageCode.AM, LanguageCode.RU, LanguageCode.EN];
    const temp =
      value && value.filter((item) => requiredLanguages.includes(item.lgCode) && item.field === TranslationFields.NAME);
    if (temp && temp.length < 3) return false;
    return true;
  }
}
export function IsCodeValid(validationOptions?: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCodeValidConstraint,
    });
  };
}
