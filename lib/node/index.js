"use strict";
/**
 * A minimal library for pivoting data by 1-n dimensions.
 *
 * The {@link pivot} function slices and dices data by one or more {@link Dimension dimensions}, returning a {@link Matrix} if one {@link Dimension} is passed, a {@link Cube} if two
 * {@link Dimension dimensions} are passed, and a {@link Hypercube} if more than two {@link Dimension dimensions} are passed.
 *
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link property} function and a property name from the data set to be pivoted.
 *
 * Once a {@link Cube} is created, the {@link aggregate} function can be used to perform aggregate query operations on the subset of the source data in each cell.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.aggregate = exports.pivot = exports.property = exports.dimension = void 0;
/**
 * Creates a {@link Dimension} from some source data that will be used to slice and dice
 * @param source The seed data for the dimension; one entry in the source array will be one point on the dimension.
 * @param generator A function that creates a {@link Predicate} for each point on the dimension.
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
const dimension = (source, generator) => source.map(generator);
exports.dimension = dimension;
/**
 * Creates a predicate function {@link Predicate} for use in the {@link dimension} function to create a {@link Dimension} matching properties.
 * @typeParam TSource The type of the source data that will be evaluated by the generated predicate.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
const property = (key) => (criterion) => (value) => value[key] === criterion;
exports.property = property;
/**
 * Slices and dices source data by one or more dimensions, returning, {@link Matrix}, {@link Cube} or {@link Hypercube} depending on the number of dimensions passed.
 * See the overloads for more detail.
 * @example
 * The following code creates a {@link Cube}, slicing and dicing the squad data for a football team by player position and country:
 * ```ts
 * const x: Dimension<Player> = positions.map(property<Player>('position'));
 * const y: Dimension<Player> = countries.map(property<Player>('country'));
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 * ```
 * @category Cube building
 */
const pivot = (source, ...[dimension, ...dimensions]) => {
    // slice the source data by the first dimension provided
    const matrix = dimension.map((predicate) => source.filter(predicate));
    // recurse if there are other dimensions, otherwise just return the matrix
    return dimensions.length ? matrix.map((slice) => (0, exports.pivot)(slice, ...dimensions)) : matrix;
};
exports.pivot = pivot;
/**
 * Aggregates data from a {@link Cube} into a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the {@link Cube} into a result.
 * @typeParam TSource The type of the data within the {@link Cube}.
 * @typeParam TResult The type of value returned by the selector.
 * @param cube The {@link Cube} to query data from.
 * @param selector A callback {@link Function} to create a result from each cell of the {@link Cube}.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(property('position'));
 * const y: Dimension<Player> = countries.map(property('country'));
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
const aggregate = (cube, selector) => cube.map((matrix) => matrix.map(selector));
exports.aggregate = aggregate;
/**
 * Create a callback {@link Function} to pass into {@link aggregate} that sums numerical values derived by the selector {@link Function}.
 * @typeParam TSource The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(property('position'));
 * const y: Dimension<Player> = countries.map(property('country'));
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
const sum = (selector) => (source) => source.reduce((a, b) => a + selector(b), 0);
exports.sum = sum;
/**
 * Create a callback {@link Function} to pass into {@link aggregate} that averages numerical values derived by the selector {@link Function}.
 * @typeParam TSource The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code aggregates a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(property('position'));
 * const y: Dimension<Player> = countries.map(property('country'));
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
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
