"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.query = exports.property = void 0;
exports.pivot = pivot;
/**
 * Creates a predicate function {@link Predicate} for use in the {@link dimension} function to create a {@link Dimension} matching properties.
 * @typeParam TElement The type of the source data that will be evaluated by the generated predicate.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = positions.map(property<Player>('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
const property = (key) => value => element => element[key] === value;
exports.property = property;
function pivot(elements, ...[first, second, ...others]) {
    return (second ? slice(elements, first).map(vector => pivot(vector, second, ...others)) : slice(elements, first));
}
// slices the data by one dimension
const slice = (elements, dimension) => dimension.map(predicate => fastFilter(elements, predicate));
/**
 * Queries data from a {@link PivotResult} using a selector {@link Func} to transform the elements in each cell into a result.
 * @typeParam TElement The type of the data within the {@link PivotResult}.
 * @typeParam TResult The type of value returned by the selector.
 * @param matrix The {@link PivotResult} to query data from.
 * @param selector A callback {@link Func} to create a result from each cell of the {@link PivotResult}.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = positions.map(property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = countries.map((country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const query = (matrix, selector) => matrix.map(vector => vector.map(selector));
exports.query = query;
/**
 * Create a callback {@link Func} to pass into {@link query} that sums numerical values derived by the selector {@link Func}.
 * @typeParam TElement The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Func} to derive a numerical value for each object in the source data.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = positions.map(property<Player>('position')); // using the built-in property dimension generator
 * const y = countries.map((country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result = query(cube, sum(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const sum = (selector) => vector => vector.reduce((accumulator, element) => accumulator + selector(element), 0);
exports.sum = sum;
/**
 * Create a callback {@link Func} to pass into {@link query} that averages numerical values derived by the selector {@link Func}.
 * @typeParam TElement The type of the data within the cube that will be passed into the selector.
 * @param selector A callback {@link Func} to derive a numerical value for each object in the source data.
 * @returns Returns the average given the selector; note that for empty cells this will be NaN
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = positions.map(property<Player>('position')); // using the built-in property dimension generator
 * const y = countries.map((country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
const average = (selector) => vector => (0, exports.sum)(selector)(vector) / vector.length;
exports.average = average;
// fast alternative to Array.prototype.filter
function fastFilter(array, predicate) {
    const result = [];
    for (let index = 0; index < array.length; ++index) {
        if (predicate(array[index])) {
            result.push(array[index]);
        }
    }
    return result;
}
