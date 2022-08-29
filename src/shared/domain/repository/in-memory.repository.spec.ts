import { Entity } from '../entity/entity';
import { NotFoundError } from '../errors/not-found.error';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';
import { InMemoryRepository } from './in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('In memory repository unit tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });
  it('should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });

    await repository.insert(entity);

    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it('should throws an error when entity is not found', async () => {
    expect(repository.findById('fakeId')).rejects.toThrow(
      new NotFoundError(`Entity not found using id fakeId`)
    );

    const uuid = new UniqueEntityId();
    expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Entity not found using id ${uuid}`)
    );
  });

  it('should find a entity by id', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('should return all entities', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it('should throws an error on update when entity is not found', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using id ${entity.id}`)
    );
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    await repository.insert(entity);
    const updatedEntity = new StubEntity(
      { name: 'other name', price: 20 },
      entity.uniqueEntityId
    );

    await repository.update(updatedEntity);

    expect(updatedEntity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it('should throws an error on delete when entity is not found', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using id ${entity.id}`)
    );

    const uuid = new UniqueEntityId();
    expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(`Entity not found using id ${uuid}`)
    );
  });

  it('should deletes an entity', async () => {
    const entity = new StubEntity({ name: 'some name', price: 10 });
    await repository.insert(entity);

    await repository.delete(entity.id);

    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);

    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
