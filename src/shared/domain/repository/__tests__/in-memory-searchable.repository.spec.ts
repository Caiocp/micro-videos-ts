import { Entity } from '../../entity/entity';
import { InMemorySearchableRepository } from '../in-memory.repository';
import { SearchParams, SearchResult } from '../repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((i) => {
      return (
        i.props.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        i.props.price.toString() === filter
      );
    });
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => (repository = new StubInMemorySearchableRepository()));

  describe('applyFilter', () => {
    it('should return all items if filter is null', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'test2', price: 2 }),
      ];
      const filteredItems = await repository['applyFilter'](items, null);
      const spyFilterMethod = jest.spyOn(items, 'filter');
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should return filtered items if filter is not null', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'TEST', price: 1 }),
        new StubEntity({ name: 'fake', price: 2 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      let filteredItems = await repository['applyFilter'](items, 'TEST');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, '1');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 'none');
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });
  describe('applySort', () => {
    it('should return all items if sort is null', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
      ];
      let sorteredItems = await repository['applySort'](items, null, null);
      expect(sorteredItems).toStrictEqual(items);

      sorteredItems = await repository['applySort'](items, 'price', 'asc');
      expect(sorteredItems).toStrictEqual(items);
    });

    it('should return sorted items if sort is not null', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'c', price: 1 }),
      ];
      let sorteredItems = await repository['applySort'](items, 'name', 'asc');
      expect(sorteredItems).toStrictEqual([items[1], items[0], items[2]]);

      sorteredItems = await repository['applySort'](items, 'name', 'desc');
      expect(sorteredItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });
  describe('applyPagination', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'c', price: 1 }),
        new StubEntity({ name: 'd', price: 1 }),
        new StubEntity({ name: 'e', price: 1 }),
      ];
      let paginatedItems = await repository['applyPagination'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);

      paginatedItems = await repository['applyPagination'](items, 2, 2);
      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await repository['applyPagination'](items, 3, 2);
      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await repository['applyPagination'](items, 4, 2);
      expect(paginatedItems).toStrictEqual([]);
    });
  });
  describe('search', () => {
    it('should apply only pagination when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 1 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());

      expect(result).toEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          page: 1,
          per_page: 15,
          sort: null,
          order: null,
          filter: null,
        })
      );
    });

    it('should apply pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'TEST', price: 1 }),
        new StubEntity({ name: 'TeSt', price: 1 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'test' })
      );

      expect(result).toEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          page: 1,
          per_page: 2,
          sort: null,
          order: null,
          filter: 'test',
        })
      );

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' })
      );

      expect(result).toEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          page: 2,
          per_page: 2,
          sort: null,
          order: null,
          filter: 'TEST',
        })
      );
    });

    it('should apply pagination and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'd', price: 1 }),
        new StubEntity({ name: 'e', price: 1 }),
        new StubEntity({ name: 'c', price: 1 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            page: 1,
            per_page: 2,
            sort: 'name',
            order: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            page: 2,
            per_page: 2,
            sort: 'name',
            order: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            order: 'desc',
          }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            page: 1,
            per_page: 2,
            sort: 'name',
            order: 'desc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            order: 'desc',
          }),
          result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            page: 2,
            per_page: 2,
            sort: 'name',
            order: 'desc',
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });

    it('should apply filter, sort and pagination', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'TEST', price: 1 }),
        new StubEntity({ name: 'e', price: 1 }),
        new StubEntity({ name: 'TeSt', price: 1 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            page: 1,
            per_page: 2,
            sort: 'name',
            order: 'asc',
            filter: 'TEST',
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            page: 2,
            per_page: 2,
            sort: 'name',
            order: 'asc',
            filter: 'TEST',
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
});
