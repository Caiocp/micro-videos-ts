import { FieldsErrors } from 'shared/domain/validators/fields-validator-interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}
