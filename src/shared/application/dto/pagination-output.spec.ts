import { SearchResult } from '../../domain/repository/repository-contracts';
import { PaginateOutputMapper } from './pagination-output';

describe('PaginateOutputMapper unit tests', () => {
  it('should convert a SearchResult in output', () => {
    const result = new SearchResult({
      items: ['fake' as any],
      total: 1,
      page: 1,
      per_page: 1,
      sort: 'name',
      order: 'asc',
      filter: 'fake',
    });

    const output = PaginateOutputMapper.toPaginatedOutput(result);

    expect(output).toEqual({
      total: 1,
      current_page: 1,
      per_page: 1,
      last_page: 1,
    });
  });
});
