import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassFieldsValidator } from '../../../shared/validators/class-fields-validator';
import { CategoryProperties } from '../entities/category';

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({
    name,
    description,
    created_at,
    is_active,
  }: CategoryProperties) {
    Object.assign(this, { name, description, created_at, is_active });
  }
}

export class CategoryValidator extends ClassFieldsValidator<CategoryRules> {
  validate(data: CategoryProperties): boolean {
    return super.validate(new CategoryRules(data));
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
