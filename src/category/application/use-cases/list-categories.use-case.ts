import { CategoryRepository } from '../../domain/repository/category.repository';
import { CategoryOutputMapper, CategotyOutput } from '../dto/category-output';
import { UseCase } from '../../../shared/application/use-case';
import { SearchInputDto } from '../../../shared/application/dto/search-input';
import {
  PaginateOutputMapper,
  PaginationOutputDto,
} from '../../../shared/application/dto/pagination-output';

export type Input = SearchInputDto;

export type Output = PaginationOutputDto<CategotyOutput>;

export class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const SearchResult = await this.categoryRepo.search(params);

    return this.toOutput(SearchResult);
  }

  toOutput(result: CategoryRepository.SearchResult): Output {
    return {
      ...PaginateOutputMapper.toPaginatedOutput(result),
      items: result.items.map((item) => CategoryOutputMapper.toOutput(item)),
    };
  }
}
