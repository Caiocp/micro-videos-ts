import { Category } from '../../domain/entities/category';
import { UseCase } from '../../../shared/application/use-case';
import { CategoryRepository } from '../../domain/repository/category.repository';
import { CategoryOutputMapper, CategotyOutput } from '../dto/category-output';

export type Input = {
  id: string;
};

export type Output = CategotyOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);

    return CategoryOutputMapper.toOutput(entity);
  }

  toOutput(entity: Category): Output {
    return CategoryOutputMapper.toOutput(entity);
  }
}
