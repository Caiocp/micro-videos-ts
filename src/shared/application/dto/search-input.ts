import { SortOrder } from '../../domain/repository/repository-contracts';

export type SearchInputDto<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  order?: SortOrder | null;
  filter?: Filter | null;
};
