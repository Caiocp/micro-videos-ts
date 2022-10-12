import { Category } from '../../../domain/entities/category';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase unit tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throw error when category entity is not found', async () => {
    expect(() =>
      useCase.execute({ id: 'fakeId', name: 'fake' })
    ).rejects.toThrowError(
      new NotFoundError(`Entity not found using id fakeId`)
    );
  });

  it('should update a category', async () => {
    const updateSpy = jest.spyOn(repository, 'update');
    const entity = new Category({ name: 'movie' });
    repository.items = [entity];

    let output = await useCase.execute({ id: entity.id, name: 'test' });

    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);

    const arrange = [
      {
        input: {
          id: entity.id,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'test',
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null as any,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null as any,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'test',
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.expected);
    }
  });
});
