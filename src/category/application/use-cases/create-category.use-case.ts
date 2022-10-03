import { CategoryRepository } from '../../domain/repository/category.repository';
import { Category } from '../../domain/entities/category';
import { CategoryOutputMapper, CategotyOutput } from '../dto/category-output';
import { UseCase } from '../../../shared/application/use-case';

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategotyOutput;

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepo.insert(entity);

    return this.toOutput(entity);
  }

  toOutput(entity: Category): Output {
    return CategoryOutputMapper.toOutput(entity);
  }
}
