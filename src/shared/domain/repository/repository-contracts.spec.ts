import { SearchParams, SearchResult } from './repository-contracts';

describe('SearchParams unit tests', () => {
  test('page prop', () => {
    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 1.1, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page as any }).page).toBe(
        item.expected
      );
    });
  });

  test('per_page prop', () => {
    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'fake', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 1.1, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
      { per_page: 10, expected: 10 },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({ per_page: item.per_page as any }).per_page
      ).toBe(item.expected);
    });
  });

  test('sort prop', () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 'fake', expected: 'fake' },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 1.1, expected: '1.1' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ sort: item.sort as any }).sort).toBe(
        item.expected
      );
    });
  });

  test('order prop', () => {
    let params = new SearchParams();
    expect(params.order).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.order).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.order).toBeNull();

    params = new SearchParams({ sort: '' });
    expect(params.order).toBeNull();

    const arrange = [
      { order: null, expected: 'asc' },
      { order: undefined, expected: 'asc' },
      { order: '', expected: 'asc' },
      { order: 'fake', expected: 'asc' },
      { order: 0, expected: 'asc' },
      { order: 'asc', expected: 'asc' },
      { order: 'ASC', expected: 'asc' },
      { order: 'desc', expected: 'desc' },
      { order: 'DESC', expected: 'desc' },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({ sort: 'field', order: item.order as any }).order
      ).toBe(item.expected);
    });
  });

  test('filter prop', () => {
    let params = new SearchParams();
    expect(params.filter).toBeNull();

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 'fake', expected: 'fake' },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 1.1, expected: '1.1' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ filter: item.filter as any }).filter).toBe(
        item.expected
      );
    });
  });
});

describe('SearchResult unit tests', () => {
  test('constructor', () => {
    const arrange = [
      {
        data: {
          items: ['entity1', 'entity2'] as any,
          total: 4,
          current_page: 1,
          per_page: 2,
          sort: null,
          order: null,
          filter: null,
        },
        expected: {
          items: ['entity1', 'entity2'] as any,
          total: 4,
          current_page: 1,
          per_page: 2,
          last_page: 2,
          sort: null,
          order: null,
          filter: null,
        },
      },
      {
        data: {
          items: ['entity1', 'entity2'] as any,
          total: 4,
          current_page: 1,
          per_page: 2,
          sort: 'name',
          order: 'asc',
          filter: 'test',
        },
        expected: {
          items: ['entity1', 'entity2'] as any,
          total: 4,
          current_page: 1,
          per_page: 2,
          last_page: 2,
          sort: 'name',
          order: 'asc',
          filter: 'test',
        },
      },
    ];

    arrange.forEach((item) => {
      expect(new SearchResult(item.data).toJSON()).toStrictEqual(item.expected);
    });
  });

  it('should last_page = 1 when per_page field is greater than total field', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 4,
      current_page: 1,
      per_page: 20,
      sort: null,
      order: null,
      filter: null,
    });

    expect(result.last_page).toBe(1);
  });

  test('last_page prop when total is not multiple of per_page', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
      sort: null,
      order: null,
      filter: null,
    });

    expect(result.last_page).toBe(6);
  });
});
