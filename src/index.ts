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
 * A predicate is a boolean function, used as point on a {@link Dimension} used to evaluate source data for a specific condition.
 * @typeParam TSource The type of the source data that the predicate was created for.
 * @category Type declarations
 */
export type Predicate<TSource> = Function<TSource, boolean>;

/**
 * A dimension is a set of {@link Predicate} used to partition data.
 * @typeParam TSource The type of the source data that the {@link Dimension} was created for.
 * @category Type declarations
 */
export type Dimension<TSource> = Array<Predicate<TSource>>;

/**
 * A matrix is a two dimensional data structure.
 * @typeParam TSource The type of the source data that the matrix was created from.
 * @category Type declarations
 */
export type Matrix<TSource> = Array<Array<TSource>>;

/**
 * A cube is a three dimensional data structure.
 * @typeParam TSource The type of the source data that the cube was created from.
 * @category Type declarations
 */
export type Cube<TSource> = Matrix<Array<TSource>>;

/**
 * An n-cube is an n-dimensional data structure.
 * @category Type declarations
 */
export type Hypercube = Cube<Array<any>>;

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
export const dimension = <TDimension, TSource>(source: Array<TDimension>, generator: Function<TDimension, Predicate<TSource>>): Dimension<TSource> =>
	source.map(generator);

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
export const property = <TSource>(key: keyof TSource): Function<TSource[keyof TSource], Predicate<TSource>> =>
	(criterion: TSource[keyof TSource]) => (value: TSource) => value[key] === criterion;

/**
 * Slices and dices source data by one or more dimensions, returning, Matrix, Cube or Hypercube depending on the number of dimensions passed.
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
export const pivot: {
	/** @hidden @deprecated */
	<TSource>(source: Array<TSource>): Array<TSource>;

	/**
	 * Slices source data by one dimension, returning a Matrix.
	 * @typeParam TSource The type of the source data to be sliced.
	 * @param source The source data, an array of objects.
	 */
	<TSource>(source: Array<TSource>, dimension: Dimension<TSource>): Matrix<TSource>;

	/**
	 * Slices and dices source data by two dimensions, returning a Cube.
	 * @typeParam TSource The type of the source data to be sliced.
	 * @param source The source data, an array of objects.
	 */
	<TSource>(source: Array<TSource>, dimension1: Dimension<TSource>, dimension2: Dimension<TSource>): Cube<TSource>;

	/**
	 * Slices and dices source data by two or more dimensions, returning a Hypercube.
	 * @typeParam TSource The type of the source data to be sliced.
	 * @param source The source data, an array of objects.
	 */
	<TSource>(source: Array<TSource>, ...dimensions: Array<Dimension<TSource>>): Hypercube;
} = <TSource>(source: Array<TSource>, ...[dimension, ...dimensions]: Array<Dimension<TSource>>) => {
	// slice the source data by the first dimension provided
	const matrix: Matrix<TSource> = dimension.map((predicate: Predicate<TSource>) => source.filter(predicate));

	// recurse if there are other dimensions, otherwise just return the matrix
	return dimensions.length ? matrix.map((slice: Array<TSource>) => pivot(slice, ...dimensions)) : matrix;
}

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
export const aggregate = <TSource, TResult>(cube: Cube<TSource>, selector: Function<Array<TSource>, TResult>): Matrix<TResult> =>
	cube.map((matrix: Matrix<TSource>) => matrix.map(selector));

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
export const sum = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => source.reduce((a: number, b: TSource) => a + selector(b), 0);

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
export const average = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => sum(selector)(source) / source.length;
