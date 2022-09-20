import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCategoryUseCase unit tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    const insertSpy = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'test' });

    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    expect(insertSpy).toHaveBeenCalledTimes(1);

    output = await useCase.execute({
      name: 'test',
      description: 'description',
      is_active: false,
    });

    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: 'test',
      description: 'description',
      is_active: false,
      created_at: repository.items[1].created_at,
    });
    expect(insertSpy).toHaveBeenCalledTimes(2);
  });
});
