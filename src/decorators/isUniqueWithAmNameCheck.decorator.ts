import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUniqueWithAmNameCheck(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueWithAmNameCheck',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (!Array.isArray(value)) {
            return false;
          }

          const groupedByLgCode = value.reduce((acc, item) => {
            acc[item.lgCode] = acc[item.lgCode] || [];
            acc[item.lgCode].push(item.field);
            return acc;
          }, {});

          for (const lgCode in groupedByLgCode) {
            const fields = groupedByLgCode[lgCode];
            const uniqueFields = new Set(fields);
            if (uniqueFields.size !== fields.length) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}
