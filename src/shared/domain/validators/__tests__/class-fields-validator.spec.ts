import * as libClassValidator from 'class-validator';
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
    const validateSyncSpy = jest.spyOn(libClassValidator, 'validateSync');
    validateSyncSpy.mockReturnValue([
      {
        property: 'field',
        constraints: { isRequired: 'some error' },
      },
    ]);
    const validator = new StubClassFieldsValidator();

    expect(validator.validate(null)).toBeFalsy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validatedData).toBeFalsy();
    expect(validator.errors).toStrictEqual({ field: ['some error'] });
  });

  it('should validate without errors', () => {
    const validateSyncSpy = jest.spyOn(libClassValidator, 'validateSync');
    validateSyncSpy.mockReturnValue([]);
    const validator = new StubClassFieldsValidator();

    expect(validator.validate({ field: 'some value' })).toBeTruthy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({ field: 'some value' });
    expect(validator.errors).toBeNull();
  });
});
