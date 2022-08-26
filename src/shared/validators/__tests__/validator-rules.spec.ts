import { ValidationError } from '../../../shared/errors/validation.error';
import { ValidatorRules } from '../validator-rules';

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

describe('Validator rules', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('some value', 'some property');

    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator['value']).toBe('some value');
    expect(validator['property']).toBe('some property');
  });

  test('required validation rule', () => {
    const error = new ValidationError('property is required');
    const invalidArrange: Values[] = [
      { value: null, property: 'property' },
      { value: undefined, property: 'property' },
      { value: '', property: 'property' },
    ];

    invalidArrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error,
      });
    });

    const validArrange: Values[] = [
      { value: 'teste', property: 'property' },
      { value: 5, property: 'property' },
      { value: 0, property: 'property' },
      { value: false, property: 'property' },
    ];
    validArrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error,
      });
    });
  });

  test('string validation rule', () => {
    const error = new ValidationError('property must be a string');
    const invalidArrange: Values[] = [
      { value: 4, property: 'property' },
      { value: {}, property: 'property' },
      { value: false, property: 'property' },
    ];

    invalidArrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      });
    });

    const validArrange: Values[] = [
      { value: 'test', property: 'property' },
      { value: null, property: 'property' },
      { value: undefined, property: 'property' },
    ];
    validArrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      });
    });
  });
  test('maxLength validation rule', () => {
    const maxLength = 4;
    const error = new ValidationError(
      `property must be less than or equal ${maxLength} characters`
    );
    const invalidArrange: Values[] = [{ value: 'teste', property: 'property' }];

    invalidArrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [maxLength],
      });
    });

    const validArrange: Values[] = [
      { value: 'test', property: 'property' },
      { value: null, property: 'property' },
      { value: undefined, property: 'property' },
    ];
    validArrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [maxLength],
      });
    });
  });

  test('boolean validation rule', () => {
    const error = new ValidationError('property must be a boolean');
    const invalidArrange: Values[] = [
      { value: 'true', property: 'property' },
      { value: 'false', property: 'property' },
      { value: 0, property: 'property' },
    ];

    invalidArrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
      });
    });

    const validArrange: Values[] = [
      { value: true, property: 'property' },
      { value: false, property: 'property' },
      { value: null, property: 'property' },
      { value: undefined, property: 'property' },
    ];
    validArrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
      });
    });
  });

  it('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => validator.required().string()).toThrow('field is required');

    validator = ValidatorRules.values(1, 'field');
    expect(() => validator.required().string()).toThrow(
      'field must be a string'
    );

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow('field must be a string');

    validator = ValidatorRules.values('123456', 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow('field must be less than or equal 5 characters');

    validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow('field is required');

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow('field must be a boolean');
  });

  it('should be valid when combine two or more validation rules', () => {
    expect.assertions(0);
    ValidatorRules.values('test', 'field').required().string();
    ValidatorRules.values('12345', 'field').required().string().maxLength(5);

    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  });
});
