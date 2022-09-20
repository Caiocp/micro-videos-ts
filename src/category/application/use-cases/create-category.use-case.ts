import { CategoryRepository } from '../../domain/repository/category.repository';
import { Category } from '../../domain/entities/category';
import { CategotyOutput } from '../dto/output.dto';
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

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
