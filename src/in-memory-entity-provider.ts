import { AddCommand, BatchRemoveCommand, BatchUpdateCommand, BrowseCommand, PaginatedEntityCollection } from '@dipscope/entity-store';
import { BulkAddCommand, BulkQueryCommand, BulkRemoveCommand, BulkSaveCommand } from '@dipscope/entity-store';
import { BulkUpdateCommand, QueryCommand, RemoveCommand, SaveCommand, UpdateCommand } from '@dipscope/entity-store';
import { Entity, EntityCollection, EntityFilterFn, EntityProvider, KeyValue, Nullable } from '@dipscope/entity-store';
import { TypeMetadata } from '@dipscope/type-manager';
import { InMemoryFilterExpressionVisitor } from './in-memory-filter-expression-visitor';
import { InMemoryPaginateExpressionVisitor } from './in-memory-paginate-expression-visitor';
import { InMemoryPaginatedEntityCollection } from './in-memory-paginated-entity-collection';
import { InMemorySortExpressionVisitor } from './in-memory-sort-expression-visitor';

/**
 * In memory implementation of entity provider.
 *
 * @type {InMemoryEntityProvider}
 */
export class InMemoryEntityProvider implements EntityProvider
{
    /**
     * Entity collection map.
     *
     * @type {Map<TypeMetadata<any>, EntityCollection<any>>}
     */
    private readonly entityCollectionMap: Map<TypeMetadata<any>, EntityCollection<any>>;

    /**
     * In memory filter expression visitor.
     *
     * @type {InMemoryFilterExpressionVisitor<Entity>}
     */
    private readonly inMemoryFilterExpressionVisitor: InMemoryFilterExpressionVisitor<any>;

    /**
     * In memory sort expression visitor.
     *
     * @type {InMemorySortExpressionVisitor<Entity>}
     */
    private readonly inMemorySortExpressionVisitor: InMemorySortExpressionVisitor<any>;

    /**
     * In memory paginate expression visitor.
     *
     * @type {InMemoryPaginateExpressionVisitor<Entity>}
     */
    private readonly inMemoryPaginateExpressionVisitor: InMemoryPaginateExpressionVisitor<any>;

    /**
     * Constructor.
     */
    public constructor()
    {
        this.entityCollectionMap = new Map<TypeMetadata<any>, EntityCollection<any>>();
        this.inMemoryFilterExpressionVisitor = new InMemoryFilterExpressionVisitor<any>();
        this.inMemorySortExpressionVisitor = new InMemorySortExpressionVisitor<any>();
        this.inMemoryPaginateExpressionVisitor = new InMemoryPaginateExpressionVisitor<any>();

        return;
    }

    /**
     * Executes add command.
     *
     * @param {AddCommand<TEntity>} addCommand Add command.
     *
     * @returns {Promise<TEntity>} Added entity.
     */
    public async executeAddCommand<TEntity extends Entity>(addCommand: AddCommand<TEntity>): Promise<TEntity>
    {
        const commandEntity = addCommand.entity;
        const typeMetadata = addCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        if (!entityCollection.contains(commandEntity))
        {
            entityCollection.push(commandEntity);
        }

        return commandEntity;
    }

    /**
     * Executes bulk add command.
     *
     * @param {BulkAddCommand<TEntity>} bulkAddCommand Bulk add command.
     *
     * @returns {Promise<EntityCollection<TEntity>>} Added entity collection.
     */
    public async executeBulkAddCommand<TEntity extends Entity>(bulkAddCommand: BulkAddCommand<TEntity>): Promise<EntityCollection<TEntity>>
    {
        const commandEntityCollection = bulkAddCommand.entityCollection;
        const typeMetadata = bulkAddCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        for (const commandEntity of commandEntityCollection)
        {
            if (!entityCollection.contains(commandEntity))
            {
                entityCollection.push(commandEntity);
            }
        }

        return commandEntityCollection;
    }

    /**
     * Executes update command.
     *
     * @param {UpdateCommand<TEntity>} updateCommand Update command.
     *
     * @returns {Promise<TEntity>} Updated entity.
     */
    public async executeUpdateCommand<TEntity extends Entity>(updateCommand: UpdateCommand<TEntity>): Promise<TEntity>
    {
        const commandEntity = updateCommand.entity;
        const typeMetadata = updateCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);
        const entity = entityCollection.find(e => e === commandEntity);

        if (entity !== undefined && entity !== null)
        {
            Object.assign(entity, commandEntity);
        }

        return commandEntity;
    }

    /**
     * Executes bulk update command.
     *
     * @param {BulkUpdateCommand<TEntity>} bulkUpdateCommand Bulk update command.
     *
     * @returns {Promise<EntityCollection<TEntity>>} Updated entity collection.
     */
    public async executeBulkUpdateCommand<TEntity extends Entity>(bulkUpdateCommand: BulkUpdateCommand<TEntity>): Promise<EntityCollection<TEntity>>
    {
        const commandEntityCollection = bulkUpdateCommand.entityCollection;
        const typeMetadata = bulkUpdateCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        for (const commandEntity of commandEntityCollection)
        {
            const entity = entityCollection.find(e => e === commandEntity);

            if (entity !== undefined && entity !== null)
            {
                Object.assign(entity, commandEntity);
            }
        }

        return commandEntityCollection;
    }

    /**
     * Executes batch update command.
     *
     * @param {BatchUpdateCommand<TEntity>} batchUpdateCommand Batch update command.
     *
     * @returns {Promise<void>} Promise to update an entity collection.
     */
    public async executeBatchUpdateCommand<TEntity extends Entity>(batchUpdateCommand: BatchUpdateCommand<TEntity>): Promise<void>
    {
        const commandEntityPartial = batchUpdateCommand.entityPartial;
        const typeMetadata = batchUpdateCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineBrowsedEntityCollection(typeMetadata, batchUpdateCommand);

        for (const entity of entityCollection)
        {
            Object.assign(entity, commandEntityPartial);
        }

        return;
    }

    /**
     * Executes save command.
     *
     * @param {SaveCommand<TEntity>} saveCommand Save command.
     *
     * @returns {Promise<TEntity>} Saved entity.
     */
    public async executeSaveCommand<TEntity extends Entity>(saveCommand: SaveCommand<TEntity>): Promise<TEntity>
    {
        const commandEntity = saveCommand.entity;
        const typeMetadata = saveCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);
        const entity = entityCollection.find(e => e === commandEntity);

        if (entity === undefined || entity === null)
        {
            entityCollection.push(commandEntity);

            return commandEntity;
        }

        Object.assign(entity, commandEntity);

        return commandEntity;
    }

    /**
     * Executes bulk save command.
     *
     * @param {BulkSaveCommand<TEntity>} bulkSaveCommand Bulk save command.
     *
     * @returns {Promise<EntityCollection<TEntity>>} Saved entity collection.
     */
    public async executeBulkSaveCommand<TEntity extends Entity>(bulkSaveCommand: BulkSaveCommand<TEntity>): Promise<EntityCollection<TEntity>>
    {
        const commandEntityCollection = bulkSaveCommand.entityCollection;
        const typeMetadata = bulkSaveCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        for (const commandEntity of commandEntityCollection)
        {
            const entity = entityCollection.find(e => e === commandEntity);

            if (entity === undefined || entity === null)
            {
                entityCollection.push(commandEntity);

                continue;
            }

            Object.assign(entity, commandEntity);
        }

        return commandEntityCollection;
    }

    /**
     * Executes query command.
     *
     * @param {QueryCommand<TEntity>} queryCommand Query command.
     *
     * @returns {Promise<Nullable<TEntity>>} Entity or null.
     */
    public async executeQueryCommand<TEntity extends Entity>(queryCommand: QueryCommand<TEntity>): Promise<Nullable<TEntity>>
    {
        const typeMetadata = queryCommand.entityInfo.typeMetadata;
        const keyValues = queryCommand.keyValues;
        const entityCollection = this.defineBrowsedEntityCollection(typeMetadata, queryCommand);
        const entityFilterFn = this.defineKeyValuesEntityFilterFn(typeMetadata, keyValues);
        const entity = entityCollection.find(entityFilterFn);

        return entity;
    }

    /**
     * Executes bulk query command.
     *
     * @param {BulkQueryCommand<TEntity>} bulkQueryCommand Bulk query command.
     *
     * @returns {Promise<EntityCollection<TEntity>>} Queried entity collection.
     */
    public async executeBulkQueryCommand<TEntity extends Entity>(bulkQueryCommand: BulkQueryCommand<TEntity>): Promise<PaginatedEntityCollection<TEntity>>
    {
        const typeMetadata = bulkQueryCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineBrowsedEntityCollection(typeMetadata, bulkQueryCommand);

        return entityCollection;
    }

    /**
     * Executes remove command.
     *
     * @param {RemoveCommand<TEntity>} removeCommand Remove command.
     *
     * @returns {Promise<TEntity>} Removed entity.
     */
    public async executeRemoveCommand<TEntity extends Entity>(removeCommand: RemoveCommand<TEntity>): Promise<TEntity>
    {
        const entity = removeCommand.entity;
        const typeMetadata = removeCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        entityCollection.remove(entity);

        return entity;
    }

    /**
     * Executes bulk remove command.
     *
     * @param {BulkRemoveCommand<TEntity>} bulkRemoveCommand Bulk remove command.
     *
     * @returns {Promise<EntityCollection<TEntity>>} Removed entity collection.
     */
    public async executeBulkRemoveCommand<TEntity extends Entity>(bulkRemoveCommand: BulkRemoveCommand<TEntity>): Promise<EntityCollection<TEntity>>
    {
        const commandEntityCollection = bulkRemoveCommand.entityCollection;
        const typeMetadata = bulkRemoveCommand.entityInfo.typeMetadata;
        const entityCollection = this.defineEntityCollection(typeMetadata);

        for (const commandEntity of commandEntityCollection)
        {
            entityCollection.remove(commandEntity);
        }

        return commandEntityCollection;
    }

    /**
     * Executes batch remove command.
     *
     * @param {BatchRemoveCommand<TEntity>} batchRemoveCommand Batch remove command.
     *
     * @returns {Promise<void>} Promise to remove an entity collection.
     */
    public async executeBatchRemoveCommand<TEntity extends Entity>(batchRemoveCommand: BatchRemoveCommand<TEntity>): Promise<void>
    {
        const typeMetadata = batchRemoveCommand.entityInfo.typeMetadata;
        const commandEntityCollection = this.defineBrowsedEntityCollection(typeMetadata, batchRemoveCommand);
        const entityCollection = this.defineEntityCollection(typeMetadata);

        for (const commandEntity of commandEntityCollection)
        {
            entityCollection.remove(commandEntity);
        }

        return;
    }

    /**
     * Defines entity collection for provided type metadata.
     *
     * @param {TypeMetadata<TEntity>} typeMetadata Type metadata.
     *
     * @returns {EntityCollection<TEntity>} Entity collection for provided type metadata.
     */
    private defineEntityCollection<TEntity extends Entity>(typeMetadata: TypeMetadata<TEntity>): EntityCollection<TEntity>
    {
        let entityCollection = this.entityCollectionMap.get(typeMetadata);

        if (entityCollection === undefined || entityCollection === null)
        {
            entityCollection = new EntityCollection<TEntity>();

            this.entityCollectionMap.set(typeMetadata, entityCollection);
        }

        return entityCollection;
    }

    /**
     * Defines browsed entity collection for provided type metadata.
     *
     * @param {TypeMetadata<TEntity>} typeMetadata Type metadata.
     * @param {BrowseCommand<any, any>} browseCommand Browse command.
     *
     * @returns {EntityCollection<TEntity>} Browsed entity collection for provided type metadata.
     */
    private defineBrowsedEntityCollection<TEntity extends Entity>(typeMetadata: TypeMetadata<TEntity>, browseCommand: BrowseCommand<TEntity, any>): PaginatedEntityCollection<TEntity>
    {
        let entityCollection = this.defineEntityCollection(typeMetadata);

        if (browseCommand.filterExpression !== undefined && browseCommand.filterExpression !== null)
        {
            const entityFilterFn = browseCommand.filterExpression.accept(this.inMemoryFilterExpressionVisitor);

            entityCollection = entityCollection.filter(entityFilterFn);
        }

        if (browseCommand.sortExpression !== undefined && browseCommand.sortExpression !== null)
        {
            const entitySortFn = browseCommand.sortExpression.accept(this.inMemorySortExpressionVisitor);

            entityCollection = entityCollection.sort(entitySortFn);
        }

        if (browseCommand.paginateExpression !== undefined && browseCommand.paginateExpression !== null)
        {
            const entityPaginateFn = browseCommand.paginateExpression.accept(this.inMemoryPaginateExpressionVisitor);
            
            return entityPaginateFn(entityCollection.toArray());
        }
        
        return new InMemoryPaginatedEntityCollection(entityCollection.toArray(), 0, entityCollection.length, 0);
    }

    /**
     * Defines key values entity filter function.
     *
     * @param {TypeMetadata<TEntity>} typeMetadata Type metadata.
     * @param {ReadonlyArray<KeyValue>} keyValues Target key values.
     *
     * @returns {EntityFilterFn<TEntity>} Key values entity filter function.
     */
    private defineKeyValuesEntityFilterFn<TEntity extends Entity>(typeMetadata: TypeMetadata<TEntity>, keyValues: ReadonlyArray<KeyValue>): EntityFilterFn<TEntity>
    {
        return (entity: TEntity) =>
        {
            let keyValueIndex = 0;

            if (keyValueIndex === keyValues.length)
            {
                return true;
            }

            for (const propertyMetadata of typeMetadata.propertyMetadataMap.values())
            {
                if (entity[propertyMetadata.propertyName] !== keyValues[keyValueIndex])
                {
                    continue;
                }

                keyValueIndex++;

                if (keyValueIndex === keyValues.length)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
