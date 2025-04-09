"use strict";
/**
 * A minimal library for pivoting data by 1-n dimensions.
 *
 * The {@link pivot} function slices and dices data by one or more {@link Dimension dimensions}, returning a {@link Matrix} if one {@link Dimension} is passed, a {@link Cube} if two
 * {@link Dimension dimensions} are passed, and a {@link Hypercube} if more than two {@link Dimension dimensions} are passed.
 *
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link dimesion} and {@link property} functions.
 *
 * Once a {@link Cube} is created, the {@link query} function can be used to perform query operations on the subset of the source data in each cell.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.query = exports.property = exports.dimension = void 0;
exports.pivot = pivot;
/**
 * Creates a {@link Dimension} from some source data that will be used to slice and dice.
 * @typeParam TCriteria The type of the seed data used to creat the dimension.
 * @param values The seed data for the dimension; one entry in the source array will be one point on the dimension.
 * @param generator A function that creates a {@link Predicate} for each point on the dimension.
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property<Player>('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
const dimension = (values, generator) => map(values, generator);
exports.dimension = dimension;
/**
 * Creates a predicate function {@link Predicate} for use in the {@link dimension} function to create a {@link Dimension} matching properties.
 * @typeParam TValue The type of the source data that will be evaluated by the generated predicate.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property<Player>('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
const property = (key) => value => element => element[key] === value;
exports.property = property;
// implementation of the pivot function; the overloads above provide the appropriate return type depending on the number of dimensions passed
function pivot(array, ...[first, second, ...others]) {
    return second ? map(slice(array, first), vector => pivot(vector, second, ...others)) : slice(array, first);
}
/**
 * Queries data from a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the {@link Matrix} into a result.
 * @typeParam TValue The type of the data within the {@link Matrix}.
 * @typeParam TResult The type of value returned by the selector.
 * @param matrix The {@link Matrix} to query data from.
 * @param selector A callback {@link Function} to create a result from each cell of the {@link Cube}.
 * @remarks The {@link Matrix} may also be a {@link Cube} or {@link Hypercube}.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = dimension(positions, property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const query = (matrix, selector) => map(matrix, vector => map(vector, selector));
exports.query = query;
/**
 * Create a callback {@link Function} to pass into {@link query} that sums numerical values derived by the selector {@link Function}.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = dimension(positions, property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = query(cube, sum(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const sum = (selector) => vector => reduce(vector, (accumulator, element) => accumulator + selector(element), 0);
exports.sum = sum;
/**
 * Create a callback {@link Function} to pass into {@link query} that averages numerical values derived by the selector {@link Function}.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Function} to derive a numerical value for each object in the source data.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = dimension(positions, property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const average = (selector) => vector => (0, exports.sum)(selector)(vector) / vector.length;
exports.average = average;
// slices the data by one dimension
function slice(array, dimension) {
    return map(dimension, predicate => filter(array, predicate));
}
// fast alternative to Array.prototype.filter
function filter(array, callbackFn) {
    const result = [];
    for (let index = 0; index < array.length; ++index) {
        if (callbackFn(array[index])) {
            result.push(array[index]);
        }
    }
    return result;
}
// fast alternative to Array.prototype.map
function map(array, callbackFn) {
    const result = [];
    for (let index = 0; index < array.length; ++index) {
        result.push(callbackFn(array[index]));
    }
    return result;
}
// fast alternative to Array.prototype.reduce
function reduce(array, callbackFn, initialValue) {
    let accumulator = initialValue;
    for (let index = 0; index < array.length; ++index) {
        accumulator = callbackFn(accumulator, array[index]);
    }
    return accumulator;
}
