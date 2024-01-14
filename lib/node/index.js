"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.flatten = exports.pivot = exports.criteria = void 0;
/**
 * Creates a callback {@link Function} used in a map operation to create the {@link Predicate} for each point on a {@link Dimension} from a set of simple values.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const dimension = positions.map(criteria<Player>('position'));
 * ```
 * See src/example/index.ts for a complete example.
 * @category Core API
 */
const criteria = (key) => (criterion) => (value) => value[key] === criterion;
exports.criteria = criteria;
// the implementation of pivot
function pivot(source, ...[dimension, ...dimensions]) {
    // create a result matrix sized to the first dimension
    const matrix = dimension.map(() => []);
    // slice source data into the result matrix according to the criteria of the first dimension
    for (var value of source) {
        for (var di = 0, dl = dimension.length; di < dl; ++di) {
            if (dimension[di](value)) {
                matrix[di].push(value);
                break;
            }
        }
    }
    // recurse if there are other dimensions, otherwise just return the matrix
    return dimensions.length ? matrix.map(slice => pivot(slice, ...dimensions)) : matrix;
}
exports.pivot = pivot;
/**
 * Flattens a {@link Cube} into a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the cube into a result.
 * @typeParam TValue The type of the data within the cube.
 * @param cube The cube to query data from.
 * @param selector A callback {@link Function} to create a result from each cell of the cube.
 * @example
 * The following code flattens a {@link Cube}, returning the {@link average} age of players in a squad as at 23rd March 2021:
 * ```ts
 * const cube = pivot(squad, y, x);
 * const result = flatten(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): (person: { dateOfBirth: Date }) => number {
 *   return (player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * @category Cube query helpers
 */
const flatten = (cube, selector) => cube.map(matrix => matrix.map(selector));
exports.flatten = flatten;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
const sum = (selector) => (source) => source.reduce((a, b) => a + selector(b), 0);
exports.sum = sum;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
