import { SearchResult } from '../../domain/repository/repository-contracts';

export type PaginationOutputDto<Item = any> = {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  items: Item[];
};

export class PaginateOutputMapper {
  static toPaginatedOutput(
    result: SearchResult
  ): Omit<PaginationOutputDto, 'items'> {
    return {
      total: result.total,
      current_page: result.page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
