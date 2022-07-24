import { CursorPaginateExpression, Entity, EntityPaginateFn, OffsetPaginateExpression, PaginateExpressionNotSupportedError } from '@dipscope/entity-store';
import { PaginateExpressionVisitor, SizePaginateExpression } from '@dipscope/entity-store';
import { InMemoryPaginatedEntityCollection } from './in-memory-paginated-entity-collection';

/**
 * In memory paginate expression visitor which traverses expression tree and returns a result.
 *
 * @type {InMemoryPaginateExpressionVisitor<TEntity>}
 */
export class InMemoryPaginateExpressionVisitor<TEntity extends Entity> implements PaginateExpressionVisitor<EntityPaginateFn<TEntity>>
{
    /**
     * Visits cursor paginate expression.
     *
     * @param {CursorPaginateExpression} cursorPaginateExpression Cursor paginate expression.
     *
     * @returns {TResult} Expression result.
     */
    public visitCursorPaginateExpression(cursorPaginateExpression: CursorPaginateExpression): EntityPaginateFn<TEntity>
    {
        throw new PaginateExpressionNotSupportedError(cursorPaginateExpression, this);
    }

    /**
     * Visits offset paginate expression.
     *
     * @param {OffsetPaginateExpression} offsetPaginateExpression Offset paginate expression.
     *
     * @returns {TResult} Expression result.
     */
    public visitOffsetPaginateExpression(offsetPaginateExpression: OffsetPaginateExpression): EntityPaginateFn<TEntity>
    {
        return (entities: ReadonlyArray<TEntity>) =>
        {
            const pageIndex = 0;
            const pageLength = offsetPaginateExpression.limit ?? 20;
            const offset = offsetPaginateExpression.offset ?? 0;

            return new InMemoryPaginatedEntityCollection(entities, pageIndex, pageLength, offset);
        };
    }
    
    /**
     * Visits size paginate expression.
     *
     * @param {SizePaginateExpression} sizePaginateExpression Size paginate expression.
     *
     * @returns {TResult} Expression result.
     */
    public visitSizePaginateExpression(sizePaginateExpression: SizePaginateExpression): EntityPaginateFn<TEntity>
    {
        return (entities: ReadonlyArray<TEntity>) =>
        {
            const pageIndex = sizePaginateExpression.page ?? 0;
            const pageLength = sizePaginateExpression.size ?? 20;
            const offset = 0;

            return new InMemoryPaginatedEntityCollection(entities, pageIndex, pageLength, offset);
        };
    }
}
