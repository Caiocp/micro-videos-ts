import { Category } from '../../domain/entities/category';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('Category in memory repository unit tests', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it('should return all categories when filter is null', async () => {
    const category = new Category({ name: 'test' });
    const categories = Array(16).fill(category);
    const filterSpy = jest.spyOn(categories, 'filter');

    const result = await repository['applyFilter'](categories, null);

    expect(result).toStrictEqual(categories);
    expect(filterSpy).not.toHaveBeenCalled();
  });

  it('should return correct category when using filter', async () => {
    const categories = [
      new Category({ name: 'test' }),
      new Category({ name: 'TEST' }),
      new Category({ name: 'category' }),
    ];
    const filterSpy = jest.spyOn(categories, 'filter');

    const result = await repository['applyFilter'](categories, 'category');

    expect(result).toStrictEqual([categories[2]]);
    expect(filterSpy).toHaveBeenCalledTimes(1);
  });

  it('should return all categories ordered by created_at when sort is null', async () => {
    const created_at = new Date();
    const categories = [
      new Category({
        name: 'test',
        created_at: new Date(created_at.getTime() + 200),
      }),
      new Category({
        name: 'TEST',
        created_at: new Date(created_at.getTime() + 100),
      }),
      new Category({
        name: 'category',
        created_at,
      }),
    ];

    const result = await repository['applySort'](categories, null, null);

    expect(result).toStrictEqual(categories);
  });

  it('should sort categories by name', async () => {
    const categories = [
      new Category({ name: 'c' }),
      new Category({ name: 'b' }),
      new Category({ name: 'a' }),
    ];

    const result = await repository['applySort'](categories, 'name', 'asc');

    expect(result).toStrictEqual([categories[2], categories[1], categories[0]]);
  });
});
