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
 * @typeParam TValue The type of the source data that the predicate was created for.
 * @category Type declarations
 */
export type Predicate<TElement> = Function<TElement, boolean>;

/**
 * A dimension is a set of {@link Predicate} used to partition data.
 * @typeParam TValue The type of the source data that the {@link Dimension} was created for.
 * @category Type declarations
 */
export type Dimension<TElement> = Array<Predicate<TElement>>;

/**
 * A Matrix is a two dimensional data structure.
 * @typeParam TValue The type of the source data that the Matrix was created from.
 * @category Type declarations
 */
export type Matrix<TElement> = Array<Array<TElement>>;

/**
 * A cube is a three dimensional data structure.
 * @typeParam TValue The type of the source data that the cube was created from.
 * @category Type declarations
 */
export type Cube<TElement> = Matrix<Array<TElement>>;

/**
 * An n-cube is an n-dimensional data structure.
 * @category Type declarations
 */
export type Hypercube = Cube<Array<any>>;

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
export const dimension = <TValues, TElement>(values: Array<TValues>, generator: Function<TValues, Predicate<TElement>>): Dimension<TElement> =>
	map(values, generator);

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
export const property = <TElement>(key: keyof TElement): Function<TElement[keyof TElement], Predicate<TElement>> =>
	value => element => element[key] === value;

/**
 * Slices data by one dimension, returning a {@link Matrix}.
 * @typeParam TValue The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param first The first dimension to slice the data by.
 * @category Cube building
 */
export function pivot<TElement>(elements: Array<TElement>, first: Dimension<TElement>): Matrix<TElement>;

/**
 * Slices data by two dimensions, returning a {@link Cube}.
 * @typeParam TValue The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param first The first dimension to slice the data by.
 * @param second The second dimension to dice the data by.
 * @category Cube building
 */
export function pivot<TElement>(elements: Array<TElement>, first: Dimension<TElement>, second: Dimension<TElement>): Cube<TElement>;

/**
 * Slices data by three or more dimensions, returning a {@link Hypercube}.
 * @typeParam TValue The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param first The first dimension to slice the data by.
 * @param others Two or more other dimensions to pivot the data by.
 * @category Cube building
 */
export function pivot<TElement>(elements: Array<TElement>, first: Dimension<TElement>, ...others: Array<Dimension<TElement>>): Hypercube;

// implementation of the pivot function; the overloads above provide the appropriate return type depending on the number of dimensions passed
export function pivot<TElement>(elements: Array<TElement>, ...[first, second, ...others]: Array<Dimension<TElement>>) {
	return second ? map(slicer(elements, first), slice => pivot(slice, second, ...others)) : slicer(elements, first);
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
export const query = <TElement, TResult>(matrix: Matrix<TElement>, selector: Function<TElement, TResult>): Matrix<TResult> =>
	map(matrix, slice => map(slice, selector));

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
export const sum = <TElement>(selector: Function<TElement, number>): Function<Array<TElement>, number> =>
	slice => reduce(slice, (accumulator, element) => accumulator + selector(element), 0);

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
export const average = <TElement>(selector: Function<TElement, number>): Function<Array<TElement>, number> =>
	slice => sum(selector)(slice) / slice.length;

// slices the data by one dimension
function slicer<TElement>(elements: Array<TElement>, dimension: Dimension<TElement>): Matrix<TElement> {
	return map(dimension, predicate => filter(elements, predicate));
}


// fast alternative to Array.prototype.filter
function filter<T>(array: Array<T>, callbackFn: (value: T) => boolean): Array<T> {
	const result: Array<T> = [];

	for (let index = 0; index < array.length; ++index) {
		if (callbackFn(array[index])) {
			result.push(array[index]);
		}
	}

	return result;
}

// fast alternative to Array.prototype.map
function map<T, U>(array: Array<T>, callbackFn: (value: T) => U): Array<U> {
	const result: Array<U> = [];

	for (let index = 0; index < array.length; ++index) {
		result.push(callbackFn(array[index]));
	}

	return result;
}

// fast alternative to Array.prototype.reduce
function reduce<T, U>(array: Array<T>, callbackFn: (accumulator: U, element: T) => U, initialValue: U): U {
	let accumulator: U = initialValue;

	for (let index = 0; index < array.length; ++index) {
		accumulator = callbackFn(accumulator, array[index]);
	}

	return accumulator;
}
