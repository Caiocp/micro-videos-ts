import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository';
import { GetCategoryUseCase } from '../get-category.use-case';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Category } from '../../../domain/entities/category';

describe('GetCategoryUseCase unit tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throw error when category entity is not found', async () => {
    expect(() => useCase.execute({ id: 'fakeId' })).rejects.toThrowError(
      new NotFoundError(`Entity not found using id fakeId`)
    );
  });

  it('should return a category', async () => {
    const items = [new Category({ name: 'movie' })];
    repository.items = items;

    const findByIdSpy = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].id });
    expect(output).toStrictEqual({
      id: items[0].id,
      name: 'movie',
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });
    expect(findByIdSpy).toBeCalledTimes(1);
  });
});
