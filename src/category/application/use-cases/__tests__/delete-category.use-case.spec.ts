import { Category } from '../../../domain/entities/category';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase unit tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throw error when category entity is not found', async () => {
    expect(() => useCase.execute({ id: 'fakeId' })).rejects.toThrowError(
      new NotFoundError(`Entity not found using id fakeId`)
    );
  });

  it('should delete a category', async () => {
    const deleteSpy = jest.spyOn(repository, 'delete');
    const entity = new Category({ name: 'movie' });
    repository.items = [entity];

    await useCase.execute({ id: entity.id });

    expect(repository.items).toHaveLength(0);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
