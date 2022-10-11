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
});
