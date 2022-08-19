import { deepFreeze } from './object';

describe('Object', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze('a');
    expect(typeof str).toBe('string');

    let boolean = deepFreeze(true);
    expect(typeof boolean).toBe('boolean');
    boolean = deepFreeze(false);
    expect(typeof boolean).toBe('boolean');

    const num = deepFreeze(1);
    expect(typeof num).toBe('number');
  });

  it('should be a immutable object', () => {
    const obj = deepFreeze({
      prop1: 'value1',
      deep: { prop2: 'value2', prop3: new Date() },
    });

    expect(() => ((obj.prop1 as any) = 'test')).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => ((obj.deep.prop2 as any) = 'test')).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });
});
