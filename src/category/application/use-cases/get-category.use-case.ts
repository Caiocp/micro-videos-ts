import { UseCase } from '../../../shared/application/use-case';
import { CategoryRepository } from '../../domain/repository/category.repository';
import { CategotyOutput } from '../dto/output.dto';

export type Input = {
  id: string;
};

export type Output = CategotyOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
