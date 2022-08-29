import { Category } from './category';

describe('Category integration tests', () => {
  describe('create method', () => {
    it('should throw a validation error when create a category with invalid name', () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => new Category({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(
        () => new Category({ name: 'a'.repeat(256) })
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });

    it('should throw a validation error when create a category with invalid description', () => {
      expect(
        () => new Category({ name: 'some name', description: 5 as any })
      ).containsErrorMessages({
        description: ['description must be a string'],
      });
    });

    it('should throw a validation error when create a category with invalid is_active', () => {
      expect(
        () => new Category({ name: 'some name', is_active: '' as any })
      ).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      });
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
      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => category.update('', null)).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => category.update(5 as any, null)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() =>
        category.update('t'.repeat(256), null)
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });

    it('should throw a validation error when update a category with invalid description', () => {
      const category = new Category({ name: 'Movie' });
      expect(() => category.update('Movie', 5 as any)).containsErrorMessages({
        description: ['description must be a string'],
      });
    });

    it('should update a valid category', () => {
      expect.assertions(0);
      const category = new Category({ name: 'Movie' });
      category.update('Other movie', null);
      category.update('Same movie', 'Some description');
    });
  });
});
