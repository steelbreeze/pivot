/**
 * A minimal library for pivoting data by 1-n dimensions.
 * 
 * The {@link pivot} function slices and dices data by one or more {@link Dimension dimensions}, returning a {@link Matrix} if one {@link Dimension} is passed, a {@link Cube} if two
 * {@link Dimension dimensions} are passed, and a {@link Hypercube} if more than two {@link Dimension dimensions} are passed.
 * 
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link property} function and a property name from the data set to be pivoted.
 * 
 * Once a {@link Cube} is created, the {@link query} function can be used to perform query operations on the subset of the source data in each cell.
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
	map(source, generator);

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
 * Slices data by one dimension, returning a {@link Matrix}.
 * @typeParam TSource The type of the source data to be sliced.
 * @param source The source data, an array of objects.
 * @param dimension The dimension to slice the data by.
 * @example
 * The following code creates a {@link Cube}, slicing and dicing the squad data for a football team by player position and country:
 * ```ts
 * const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator
 * 
 * const cube: Matrix<Player> = slice(squad, y);
 * ```
 * @category Cube building
 * @remarks This is equivalent to {@link pivot} with one dimension.
 */
export const slice = <TSource>(source: Array<TSource>, dimension: Dimension<TSource>): Matrix<TSource> =>
	map(dimension, (predicate: Predicate<TSource>) => filter(source, predicate));

/**
 * Slices and dices source data by one or more dimensions, returning, {@link Matrix}, {@link Cube} or {@link Hypercube} depending on the number of dimensions passed.
 * See the overloads for more detail.
 * @example
 * The following code creates a {@link Cube}, slicing and dicing the squad data for a football team by player position and country:
 * ```ts
 * const x = dimension(positions, property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator
 * 
 * const cube: Cube<Player> = pivot(squad, y, x);
 * ```
 * @category Cube building
 */
export const pivot: {
	/**
	 * Slices data by two dimensions, returning a {@link Cube}.
	 * @typeParam TSource The type of the source data to be sliced and diced.
	 * @param source The source data, an array of objects.
	 * @param first The first dimension to slice the data by.
	 */
	<TSource>(source: Array<TSource>, first: Dimension<TSource>): Matrix<TSource>;

	/**
	 * Slices data by two dimensions, returning a {@link Cube}.
	 * @typeParam TSource The type of the source data to be sliced and diced.
	 * @param source The source data, an array of objects.
	 * @param first The first dimension to slice the data by.
	 * @param second The second dimension to dice the data by.
	 */
	<TSource>(source: Array<TSource>, first: Dimension<TSource>, second: Dimension<TSource>): Cube<TSource>;

	/**
	 * Slices data by three or more dimensions, returning a {@link Hypercube}.
	 * @typeParam TSource The type of the source data to be sliced and diced.
	 * @param source The source data, an array of objects.
	 * @param first The first dimension to slice the data by.
	 * @param others Two or more other dimensions to pivot the data by.
	 */
	<TSource>(source: Array<TSource>, first: Dimension<TSource>, ...others: Array<Dimension<TSource>>): Hypercube;
} = <TSource>(source: Array<TSource>, first: Dimension<TSource>, ...[second, ...others]: Array<Dimension<TSource>>) =>
		second ? map(slice(source, first), (sliced: Array<TSource>) => pivot(sliced, second, ...others)) : slice(source, first);

/**
 * Queries data from a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the {@link Matrix} into a result.
 * @typeParam TSource The type of the data within the {@link Matrix}.
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
export const query = <TSource, TResult>(matrix: Matrix<TSource>, selector: Function<TSource, TResult>): Matrix<TResult> =>
	map(matrix, (sliced: Array<TSource>) => map(sliced, selector));

/**
 * Create a callback {@link Function} to pass into {@link query} that sums numerical values derived by the selector {@link Function}.
 * @typeParam TSource The type of the data within the cube that will be passed into the selector.
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
export const sum = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => reduce(source, (a: number, b: TSource) => a + selector(b), 0);

/**
 * Create a callback {@link Function} to pass into {@link query} that averages numerical values derived by the selector {@link Function}.
 * @typeParam TSource The type of the data within the cube that will be passed into the selector.
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
export const average = <TSource>(selector: Function<TSource, number>): Function<Array<TSource>, number> =>
	(source: Array<TSource>) => sum(selector)(source) / source.length;

// fast alternative to Array.prototype.filter
function filter<TSource>(source: Array<TSource>, predicate: Predicate<TSource>): Array<TSource> {
	const result: Array<TSource> = [];

	for (let i = 0; i < source.length; ++i) {
		if (predicate(source[i])) {
			result.push(source[i]);
		}
	}

	return result;
}

// fast alternative to Array.prototype.map
function map<TSource, TResult>(source: Array<TSource>, mapper: Function<TSource, TResult>): Array<TResult> {
	const result: Array<TResult> = [];

	for (let i = 0; i < source.length; ++i) {
		result.push(mapper(source[i]));
	}

	return result;
}

// fast alternative to Array.prototype.reduce
function reduce<TSource, TResult>(source: Array<TSource>, reducer: (acc: TResult, value: TSource) => TResult, initialValue: TResult): TResult {
	let result: TResult = initialValue;

	for (let i = 0; i < source.length; ++i) {
		result = reducer(result, source[i]);
	}

	return result;
}