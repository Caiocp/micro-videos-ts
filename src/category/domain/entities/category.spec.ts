import { omit } from 'lodash';
import UniqueEntityId from '../../../shared/domain/value-objects/unique-entity-id.vo';

import { Category, CategoryProperties } from './category';

describe('Category', () => {
  test('Category constructor', () => {
    let category = new Category({ name: 'Movie' });
    let props = omit(category.props, 'created_at');
    expect(props).toStrictEqual({
      name: 'Movie',
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: 'Movie',
      description: 'Movie description',
      is_active: false,
      created_at,
    });
    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: 'Movie description',
      is_active: false,
      created_at,
    });

    category = new Category({
      name: 'Movie',
      description: 'some description',
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'some description',
    });

    category = new Category({
      name: 'Movie',
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      is_active: true,
    });

    created_at = new Date();
    category = new Category({
      name: 'Movie',
      created_at,
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      created_at,
    });
  });

  test('id prop', () => {
    type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: 'Movie' } },
      { props: { name: 'Movie' }, id: null },
      { props: { name: 'Movie' }, id: undefined },
      { props: { name: 'Movie' }, id: new UniqueEntityId() },
    ];

    data.forEach((item) => {
      let category = new Category(item.props, item.id);
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test('Getter and setter of name field', () => {
    const category = new Category({ name: 'Movie' });
    expect(category.name).toBe('Movie');

    category['name'] = 'some name';
    expect(category.name).toBe('some name');
  });

  test('Getter and setter of description prop', () => {
    let category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });
    expect(category.description).toBe('Movie description');

    category = new Category({
      name: 'Movie',
    });
    expect(category.description).toBeNull();

    category = new Category({
      name: 'Movie',
    });
    category['description'] = 'some description';
    expect(category.description).toBe('some description');

    category['description'] = undefined;
    expect(category.description).toBeNull();
  });

  test('Getter and setter of is_active prop', () => {
    let category = new Category({
      name: 'Movie',
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: 'Movie',
    });

    category['is_active'] = false;
    expect(category.is_active).toBeFalsy();

    category['is_active'] = true;
    expect(category.is_active).toBeTruthy();
  });

  test('Getter of created_at prop', () => {
    let category = new Category({
      name: 'Movie',
    });
    expect(category.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: 'Movie',
      created_at,
    });

    expect(category.created_at).toBe(created_at);
  });

  it('should update name and description', () => {
    const category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });
    category.update('Movie 2', 'Movie 2 description');
    expect(category.props).toMatchObject({
      name: 'Movie 2',
      description: 'Movie 2 description',
    });
  });

  it('should activate and deactivate category', () => {
    const category = new Category({
      name: 'Movie',
    });
    category.activate();
    expect(category.is_active).toBeTruthy();

    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
});
