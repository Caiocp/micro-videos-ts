import { validate as uuidValidate } from 'uuid';

import { InvalidUuidError } from '../../errors/invalid-uuid.error';
import UniqueEntityId from '../unique-entity-id.vo';

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, 'validate');
}

describe('UniqueEntityId', () => {
  it('should throw error when uuid is invalid', () => {
    const validateSpy = spyValidateMethod();

    expect(() => new UniqueEntityId('fake id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const uuid = '14351277-5fa2-45f2-8d23-f4392b517f65';
    const vo = new UniqueEntityId(uuid);
    const validateSpy = spyValidateMethod();

    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const vo = new UniqueEntityId();
    const validateSpy = spyValidateMethod();

    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
