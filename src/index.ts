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

/**
 * A simple function, taking an agrument and returning a result.
 * @typeParam TArg The type of the argument passed into the function.
 * @typeParam TResult The type of the result provided by the functions.
 * @typeParam arg The argument passed into the function.
 * @category Type declarations
 */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/**
 * A criteria is point on a {@link Dimension} used to evaluate source data for a specific condition.
 * @typeParam TValue The type of the source data that the criteria was created for.
 * @category Type declarations
 */
export type Criteria<TValue> = Function<TValue, boolean>;

/**
 * A dimension is a set of {@link Criteria} used to partition data.
 * @typeParam TValue The type of the source data that the {@link Dimension} was created for.
 * @category Type declarations
 */
export type Dimension<TValue> = Array<Criteria<TValue>>;

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
export type Hypercube = Cube<Array<any>>;

/**
 * Creates a {@link Dimension} from some source data that will be used to slice and dice 
 * @param source The seed data for the dimension; one entry in the source array will be one point on the dimension.
 * @param generator A function that creates a {@link Criteria} for each point on the dimension.
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property('position'));
 */
export function dimension<DValue, TValue>(source: Array<DValue>, generator: Function<DValue, Criteria<TValue>>): Dimension<TValue> {
	return source.map(generator);
}
/**
 * Creates a function {@link Function} for use in the {@link dimension} function to create a {@link Dimension} matching properties.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this {@link Criteria} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x = dimension(positions, property('position'));
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
export function property<TValue>(key: keyof TValue): Function<TValue[keyof TValue], Criteria<TValue>> {
	return (criterion: TValue[keyof TValue]) => (value: TValue) => value[key] === criterion;
}

/**
 * Discourage calls to pivot functions without and dimensions.
 * @deprecated Pass at least one dimension to the pivot operation.
 * @hidden
 */
export function pivot<TValue>(source: Array<TValue>): Matrix<TValue>;

/**
 * Pivots source data by one {@link Dimension} returning a {@link Matrix}.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimension The {@link Dimension} used to pivot the source data by.
 * @example
 * The following code creates a {@link Matrix} of ```Player``` objects, pivoted by their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * 
 * const matrix: Matrix<Player> = pivot(squad, x);
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
export function pivot<TValue>(source: Array<TValue>, dimension: Dimension<TValue>): Matrix<TValue>;

/**
 * Pivots source data by two {@link Dimension dimensions} returning a {@link Cube}.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimension1 The first {@link Dimension} used to pivot the source data.
 * @param dimension2 The second {@link Dimension} used to pivot the source data.
 * @example
 * The following code creates a {@link Cube} of ```Player``` objects, pivoted by their ```country``` property then by their ```position``` property:
 * ```ts
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * const y: Dimension<Player> = countries.map(criteria('country'));
 * 
 * const cube: Cube<Player> = pivot(squad, y, x);
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
export function pivot<TValue>(source: Array<TValue>, dimension1: Dimension<TValue>, dimension2: Dimension<TValue>): Cube<TValue>;

/**
 * Pivots source data by any number of {@link Dimension dimensions} returning a {@link Hypercube}.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimensions The {@link Dimension dimensions} to pivot the source data by.
 * @returns Because of the arbitory number of {@link Dimension dimensions} that can be passed to this overload, the shape of the {@link Hypercube} cannot be known. 
 * @remarks While it is possible to pass no {@link Dimension} arguments into this overload of the pivot function, it will result in an exception being thrown.
 * @example
 * The following code creates a {@link Hypercube}, pivoting the source data by three {@link Dimension dimensions} (though it can be any number):
 * ```ts
 * const hypercube: Hypercube = pivot(data, z, y, x);
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube building
 */
export function pivot<TValue>(source: Array<TValue>, ...dimensions: Array<Dimension<TValue>>): Hypercube;

// the implementation of pivot
export function pivot<TValue>(source: Array<TValue>, ...[dimension, ...dimensions]: Array<Dimension<TValue>>) {
	const matrix: Matrix<TValue> = dimension.map((criteria: Criteria<TValue>) => source.filter(criteria));

	// recurse if there are other dimensions, otherwise just return the matrix
	return dimensions.length ? matrix.map((slice: Array<TValue>) => pivot(slice, ...dimensions)) : matrix;
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
export function aggregate<TValue, TResult>(cube: Cube<TValue>, selector: Function<Array<TValue>, TResult>): Matrix<TResult> {
	return cube.map((matrix: Matrix<TValue>) => matrix.map(selector));
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
export function sum<TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> {
	return (source: Array<TValue>) => source.reduce((a: number, b: TValue) => a + selector(b), 0);
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
export function average<TValue>(selector: Function<TValue, number>): Function<Array<TValue>, number> {
	return (source: Array<TValue>) => sum(selector)(source) / source.length;
}
