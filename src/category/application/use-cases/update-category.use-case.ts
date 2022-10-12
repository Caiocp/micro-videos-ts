import { CategoryRepository } from '../../domain/repository/category.repository';
import { Category } from '../../domain/entities/category';
import { CategoryOutputMapper, CategotyOutput } from '../dto/category-output';
import { UseCase } from '../../../shared/application/use-case';

export type Input = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategotyOutput;

export class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);
    entity.update(input.name, input.description);

    if (input.is_active === true) {
      entity.activate();
    }
    if (input.is_active === false) {
      entity.deactivate();
    }

    await this.categoryRepo.update(entity);

    return this.toOutput(entity);
  }

  toOutput(entity: Category): Output {
    return CategoryOutputMapper.toOutput(entity);
  }
}
