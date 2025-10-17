import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUnique' })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (!Array.isArray(value)) return true;
    const property = args.constraints[0] as string;
    const values = (value as Record<string, unknown>[]).map((item) => item[property]);
    const uniqueValues = new Set(values);
    return uniqueValues.size === values.length;
  }
}

export function IsUnique(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUniqueConstraint,
    });
  };
}
