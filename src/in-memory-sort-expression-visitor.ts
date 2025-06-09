import { Entity, EntitySortFn, SortExpressionVisitor } from '@dipscope/entity-store';
import { AscSortExpression, DescSortExpression } from '@dipscope/entity-store';

/**
 * In memory sort expression visitor which traverses expression tree and returns a result.
 *
 * @type {InMemorySortExpressionVisitor<TEntity>}
 */
export class InMemorySortExpressionVisitor<TEntity extends Entity> implements SortExpressionVisitor<EntitySortFn<TEntity>>
{
    /**
     * Visits asc sort expression.
     *
     * @param {AscSortExpression} ascSortExpression Asc sort expression.
     *
     * @returns {EntitySortFn<TEntity>} Expression result.
     */
    public visitAscSortExpression(ascSortExpression: AscSortExpression): EntitySortFn<TEntity>
    {
        return (x: TEntity, y: TEntity) =>
        {
            const parentSortExpression = ascSortExpression.parentSortExpression;
            const parentSortResult = (parentSortExpression === undefined || parentSortExpression === null) ? 0 : parentSortExpression.accept(this)(x, y);

            if (parentSortResult !== 0)
            {
                return parentSortResult;
            }

            const propertyInfo = ascSortExpression.propertyInfo;
            const xPropertyValue = propertyInfo.extractPropertyValue(x);
            const yPropertyValue = propertyInfo.extractPropertyValue(y);

            if (xPropertyValue > yPropertyValue)
            {
                return 1;
            }

            if (xPropertyValue < yPropertyValue)
            {
                return -1;
            }

            return 0;
        };
    }

    /**
     * Visits desc sort expression.
     *
     * @param {DescSortExpression} descSortExpression Desc sort expression.
     *
     * @returns {EntitySortFn<TEntity>} Expression result.
     */
    public visitDescSortExpression(descSortExpression: DescSortExpression): EntitySortFn<TEntity>
    {
        return (x: TEntity, y: TEntity) =>
        {
            const parentSortExpression = descSortExpression.parentSortExpression;
            const parentSortResult = (parentSortExpression === undefined || parentSortExpression === null) ? 0 : parentSortExpression.accept(this)(x, y);

            if (parentSortResult !== 0)
            {
                return parentSortResult;
            }

            const propertyInfo = descSortExpression.propertyInfo;
            const xPropertyValue = propertyInfo.extractPropertyValue(x);
            const yPropertyValue = propertyInfo.extractPropertyValue(y);

            if (xPropertyValue > yPropertyValue)
            {
                return -1;
            }

            if (xPropertyValue < yPropertyValue)
            {
                return 1;
            }

            return 0;
        };
    }
}
