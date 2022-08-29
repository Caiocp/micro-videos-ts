import expectLib from 'expect';
import { EntityValidationError } from '../errors/validation.error';

import { ClassFieldsValidator } from '../validators/class-fields-validator';
import { FieldsErrors } from '../validators/fields-validator-interface';

type Expected =
  | {
      validator: ClassFieldsValidator<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessages(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);
      if (validated) {
        return isValid();
      }

      return assertContainsErrorMessages(validator.errors, received);
    }
  },
});

function isValid() {
  return { pass: true, message: () => '' };
}

function assertContainsErrorMessages(
  expected: FieldsErrors,
  received: FieldsErrors
) {
  const isMatch = expectLib
    .objectContaining(received)
    .asymmetricMatch(expected);

  return isMatch
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      };
}
