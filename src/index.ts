/**
 * A simple function taking an agrument and returning a result.
 * @typeParam TArg The type of the argument passed into the function.
 * @typeParam TResult The type of the result provided by the functions.
 * @typeParam arg The argument passed into the function.
 * @category Type declarations
 */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/**
 * A predicate is a function returning a boolean result.
 * @typeParam TArg The type of the argument passed into the function.
 * @category Type declarations
 */
export type Predicate<TArg> = Function<TArg, boolean>;

/**
 * A dimension is a series of predicates used to partition data.
 * @typeParam TValue The type of the source data that the dimension was created for.
 * @category Type declarations
 */
export type Dimension<TValue> = Array<Predicate<TValue>>;

/**
 * A matrix is a two dimensional data structure.
 * @typeParam TValue The type of the source data that the matrix was created from.
 * @category Type declarations
 */
export type Matrix<TValue> = Array<Array<TValue>>;

/**
 * A cube is a three dimensional data structure.
 * @typeParam TValue The type of the source data that the cube was created from.
 * @category Type declarations
 */
export type Cube<TValue> = Matrix<Array<TValue>>;

/**
 * An n-cube is an n-dimensional data structure.
 * @category Type declarations
 */
export type Hypercube = Array<any>;

/**
 * Create a callback to used in a map operation to create the predicate for each point on a dimension from a set of simple values.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this predicate on.
 * @category Core API
 */
export const criteria = <TValue>(key: keyof TValue): Function<TValue[keyof TValue], Predicate<TValue>> =>
	(criterion: TValue[keyof TValue]) => (value: TValue) => value[key] === criterion;

/** @deprecated Pass at least one dimension to the pivot operation. */
export function pivot<TValue>(source: Array<TValue>): Matrix<TValue>;

/**
 * Pivots source data by one dimension returning a matrix.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimension The dimension used to pivot the source data by.
 * @category Core API
 */
export function pivot<TValue>(source: Array<TValue>, dimension: Dimension<TValue>): Matrix<TValue>;

/**
 * Pivots source data by two dimensions returning a cube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimension1 The first dimension used to pivot the source data.
 * @param dimension2 The second dimension used to pivot the source data.
 * @category Core API
 */
export function pivot<TValue>(source: Array<TValue>, dimension1: Dimension<TValue>, dimension2: Dimension<TValue>): Cube<TValue>;

/**
 * Pivots source data by any number of dimensions returning a hypercube.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimensions The dimensions to pivot the source data by.
 * @category Core API
 */
export function pivot<TValue>(source: Array<TValue>, ...dimensions: Array<Dimension<TValue>>): Hypercube;

// the implementation of pivot
export function pivot<TValue>(source: Array<TValue>, ...[dimension, ...dimensions]: Array<Dimension<TValue>>) {
	// create a result matrix sized to the first dimension
	const matrix: Matrix<TValue> = dimension.map(() => []);

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

/**
 * Queries data from a cube; data previously pivoted by two dimensions.
 * @typeParam TValue The type of the data within the cube.
 * @param cube The cube to query data from.
 * @param query A callback function to create a result from each cell of the cube.
 * @category Cube query helpers
 */
export const map = <TValue, TResult>(cube: Cube<TValue>, query: Function<Array<TValue>, TResult>): Matrix<TResult> =>
	cube.map(matrix => matrix.map(query));

/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
export const sum = <TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> =>
	(source: Array<TValue>) => source.reduce((a: number, b: TValue) => a + selector(b), 0);

/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
export const average = <TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> =>
	(source: Array<TValue>) => sum(selector)(source) / source.length;
