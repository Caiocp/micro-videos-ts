import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository';
import { ListCategoriesUseCase } from '../list-categories.use-case';
import { CategoryRepository } from '../../../domain/repository/category.repository';
import { Category } from '../../../domain/entities/category';

describe('ListCategoriesUseCase unit tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      page: 1,
      per_page: 10,
      sort: null,
      order: null,
      filter: null,
    });

    let output = useCase['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 10,
      last_page: 1,
    });

    const entity = new Category({ name: 'Movie', description: 'description' });
    result = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      page: 1,
      per_page: 10,
      sort: null,
      order: null,
      filter: null,
    });

    output = useCase['toOutput'](result);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 10,
      last_page: 1,
    });
  });

  it('should return output using empty input with categories ordered by created_at', async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: 'Movie2' }),
      new Category({
        name: 'Movie',
        created_at: new Date(created_at.getTime() + 100),
      }),
    ];

    repository.items = items;

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [...items.reverse().map((item) => item.toJSON())],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagitantion, sort and filter', async () => {
    const items = [
      new Category({ name: 'a' }),
      new Category({ name: 'AAA' }),
      new Category({ name: 'AaA' }),
      new Category({ name: 'b' }),
      new Category({ name: 'c' }),
    ];

    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      order: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      order: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      order: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
