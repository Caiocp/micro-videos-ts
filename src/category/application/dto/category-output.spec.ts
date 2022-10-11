import { Category } from '../../domain/entities/category';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutput unit tests', () => {
  it('should convert a category in output', () => {
    const created_at = new Date();
    const category = new Category({
      name: 'Movie',
      description: 'description',
      is_active: true,
      created_at,
    });
    const toJSONSpy = jest.spyOn(category, 'toJSON');

    const output = CategoryOutputMapper.toOutput(category);

    expect(toJSONSpy).toHaveBeenCalled();
    expect(output).toEqual({
      id: category.id,
      name: 'Movie',
      description: 'description',
      is_active: true,
      created_at,
    });
  });
});
