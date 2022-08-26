import { ClassFieldsValidator } from '../class-fields-validator';

class StubClassFieldsValidator extends ClassFieldsValidator<{
  field: string;
}> {}

describe('Class fields validator unit tests', () => {
  it('should initiate errors and validatedData variables with null', () => {
    const validator = new StubClassFieldsValidator();

    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const validator = new StubClassFieldsValidator();
  });
});
