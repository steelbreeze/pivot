"use strict";
/**
 * A minimal library for pivoting data by 1-n dimensions.
 *
 * The {@link pivot} function slices and dices data by one or more {@link Dimension dimensions}, returning a {@link Matrix} if one {@link Dimension} is passed, a {@link Cube} if two
 * {@link Dimension dimensions} are passed, and a {@link Hypercube} if more than two {@link Dimension dimensions} are passed.
 *
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link criteria} function and a property name from the data set to be pivoted.
 *
 * Once a {@link Cube} is created, the {@link aggregate} function can be used to perform aggregate query operations on the subset of the source data in each cell.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.criteria = criteria;
exports.slice = slice;
exports.pivot = pivot;
exports.aggregate = aggregate;
exports.sum = sum;
exports.average = average;
/**
 * Creates a callback {@link Function} used in a map operation to create the {@link Criteria} for each point on a {@link Dimension} from a set of simple values.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this {@link Criteria} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x: Dimension<<Player> = positions.map(criteria('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
function criteria(key) {
    return (criterion) => (value) => value[key] === criterion;
}
/**
 * Slices a source array into a matrix based on the criteria expressed within a dimension.
 * @param source The source data, an array of objects.
 * @param dimension The {@link Dimension} used to slice the source data by.
 */
function slice(source, dimension) {
    return dimension.map((criteria) => {
        var result = [];
        for (var value of source) {
            if (criteria(value)) {
                result.push(value);
            }
        }
        return result;
    });
}
// the implementation of pivot
function pivot(source, ...[dimension, ...dimensions]) {
    // recurse if there are other dimensions, otherwise just return the matrix
    return dimensions.length ? slice(source, dimension).map(slice => pivot(slice, ...dimensions)) : slice(source, dimension);
}
/**
 * Aggregates data from a {@link Cube} into a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the {@link Cube} into a result.
 * @typeParam TValue The type of the data within the {@link Cube}.
 * @typeParam TResult The type of value returned by the selector.
 * @param cube The {@link Cube} to query data from.
 * @param selector A callback {@link Function} to create a result from each cell of the {@link Cube}.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * const y: Dimension<Player> = countries.map(criteria('country'));
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = aggregate(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
function aggregate(cube, selector) {
    return cube.map(matrix => matrix.map(selector));
}
/**
 * Create a callback {@link Function} to pass into {@link aggregate} that sums numerical values derived by the selector {@link Function}.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * const y: Dimension<Player> = countries.map(criteria('country'));
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = aggregate(cube, sum(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
function sum(selector) {
    return (source) => source.reduce((a, b) => a + selector(b), 0);
}
/**
 * Create a callback {@link Function} to pass into {@link aggregate} that averages numerical values derived by the selector {@link Function}.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * const y: Dimension<Player> = countries.map(criteria('country'));
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = aggregate(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
function average(selector) {
    return (source) => sum(selector)(source) / source.length;
}
