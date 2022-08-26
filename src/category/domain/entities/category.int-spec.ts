import { ValidationError } from '../../../shared/errors/validation.error';
import { Category } from './category';

describe('Category integration tests', () => {
  describe('create method', () => {
    it('should throw a validation error when create a category with invalid name', () => {
      expect(() => new Category({ name: null })).toThrow(
        new ValidationError('name is required')
      );

      expect(() => new Category({ name: '' })).toThrow(
        new ValidationError('name is required')
      );

      expect(() => new Category({ name: 5 as any })).toThrow(
        new ValidationError('name must be a string')
      );

      expect(() => new Category({ name: 'a'.repeat(256) })).toThrow(
        new ValidationError('name must be less than or equal 255 characters')
      );
    });

    it('should throw a validation error when create a category with invalid description', () => {
      expect(
        () => new Category({ name: 'Movie', description: 5 as any })
      ).toThrow(new ValidationError('description must be a string'));
    });

    it('should throw a validation error when create a category with invalid is_active', () => {
      expect(
        () => new Category({ name: 'Movie', is_active: '' as any })
      ).toThrow(new ValidationError('is_active must be a boolean'));
    });

    it('should create a valid category', () => {
      expect.assertions(0);
      /* NOSONAR */ new Category({ name: 'Movie' });
      /* NOSONAR */ new Category({
        name: 'Movie',
        description: 'Movie description',
      });
      /* NOSONAR */ new Category({
        name: 'Movie',
        description: null,
      });
      /* NOSONAR */ new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
      });
    });
  });

  describe('update method', () => {
    it('should throw a validation error when update a category with invalid name', () => {
      const category = new Category({ name: 'Movie' });
      expect(() => category.update(null, null)).toThrow(
        new ValidationError('name is required')
      );

      expect(() => category.update('', null)).toThrow(
        new ValidationError('name is required')
      );

      expect(() => category.update(5 as any, null)).toThrow(
        new ValidationError('name must be a string')
      );

      expect(() => category.update('t'.repeat(256), null)).toThrow(
        new ValidationError('name must be less than or equal 255 characters')
      );
    });

    it('should throw a validation error when update a category with invalid description', () => {
      const category = new Category({ name: 'Movie' });
      expect(() => category.update('Movie', 5 as any)).toThrow(
        new ValidationError('description must be a string')
      );
    });

    it('should update a valid category', () => {
      expect.assertions(0);
      const category = new Category({ name: 'Movie' });
      category.update('Other movie', null);
      category.update('Same movie', 'Some description');
    });
  });
});
