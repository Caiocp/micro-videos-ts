import { Category } from '../../domain/entities/category';

export type CategotyOutput = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategotyOutput {
    return entity.toJSON();
  }
}
