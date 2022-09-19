import { Category } from '../../../category/domain/entities/category';
import { CategoryRepository } from '../../../category/domain/repository/category.repository';
import { SortOrder } from '../../../shared/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../shared/domain/repository/in-memory.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) return items;

    return items.filter((i) => {
      return i.props.name
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    });
  }

  protected async applySort(
    items: Category[],
    sort: string | null,
    order: SortOrder | null
  ): Promise<Category[]> {
    return sort
      ? super.applySort(items, sort, order)
      : super.applySort(items, 'created_at', 'desc');
  }
}
