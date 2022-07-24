import { Entity, PaginatedEntityCollection } from '@dipscope/entity-store';

/**
 * Entity collection which allows pagination in memory.
 * 
 * @type {InMemoryPaginatedEntityCollection<TEntity>}
 */
export class InMemoryPaginatedEntityCollection<TEntity extends Entity> extends PaginatedEntityCollection<TEntity>
{
    /**
     * Selected entities to paginate.
     * 
     * @type {ReadonlyArray<TEntity>}
     */
    private readonly selectedEntities: ReadonlyArray<TEntity>;

    /**
     * Current page index.
     * 
     * @type {number}
     */
    private readonly pageIndex: number;

    /**
     * Current page length.
     * 
     * @type {number}
     */
    private readonly pageLength: number;

    /**
     * Applied offset.
     * 
     * @type {number}
     */
    private readonly offset: number;

    /**
     * Constructor.
     * 
     * @param {Array<TEntity>} selectedEntities Selected entities to paginate.
     * @param {number} pageIndex Current page index.
     * @param {number} pageLength Current page length.
     * @param {number} offset Applied offset.
     */
    public constructor(selectedEntities: ReadonlyArray<TEntity>, pageIndex: number, pageLength: number, offset: number) 
    {
        super(selectedEntities.length, selectedEntities.slice(offset + pageIndex * pageLength, (pageIndex + 1) * pageLength));

        this.selectedEntities = selectedEntities;
        this.pageIndex = pageIndex;
        this.pageLength = pageLength;
        this.offset = offset;

        return;
    }

    /**
     * Gets next page of entity collection.
     *
     * @returns {Promise<PaginatedEntityCollection<TEntity>>} Next page of entity collection.
     */
    public async nextPage(): Promise<PaginatedEntityCollection<TEntity>>
    {
        return new InMemoryPaginatedEntityCollection(this.selectedEntities, this.pageIndex + 1, this.pageLength, this.offset);
    }

    /**
     * Checks if entity collection has next page.
     *
     * @returns {boolean} True when entity collection has next page. False otherwise.
     */
    public hasNextPage(): boolean 
    {
        return (this.offset + (this.pageIndex + 1) * this.pageLength) < this.totalLength;
    }

    /**
     * Gets prev page of entity collection.
     *
     * @returns {Promise<PaginatedEntityCollection<TEntity>>} Prev page of entity collection.
     */
    public async prevPage(): Promise<PaginatedEntityCollection<TEntity>>
    {
        return new InMemoryPaginatedEntityCollection(this.selectedEntities, this.pageIndex - 1, this.pageLength, this.offset);
    }

    /**
     * Checks if entity collection has prev page.
     *
     * @returns {boolean} True when entity collection has prev page. False otherwise.
     */
    public hasPrevPage(): boolean
    {
        return (this.offset + (this.pageIndex - 1) * this.pageLength) >= this.offset;
    }
}
