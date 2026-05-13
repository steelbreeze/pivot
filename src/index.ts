/**
 * A minimal library for pivoting data by 1-n dimensions.
 * 
 * The {@link pivot} function slices data by one or more {@link Dimension dimensions}, returning a {@link Cube}, which is a nested array as deep as the number of dimensions passed into the {@link pivot} operstion.
 * 
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link dimension} and {@link property} functions.
 * 
 * Once a {@link Cube} is created, the {@link query} function can be used to perform query operations on the subset of the source data in each cell.
 * 
 * @module
 */
import { Func, Predicate } from "./types";

/**
 * A Cube is an n-dimensional data structure.
 * Each {@link Dimension} adds one array level.
 * @typeParam TElement The source element type.
 * @typeParam TDimensions The tuple of dimensions.
 * @category Type declarations
 */
export type Cube<TElement, TDimensions extends readonly unknown[]> = TDimensions extends readonly [unknown, ...infer TRest] ? Cube<TElement[], TRest> : TElement[];

/**
 * A dimension is a set of {@link Predicate} used to partition data.
 * @typeParam TElement The type of the source data that the {@link Dimension} was created for.
 * @category Type declarations
 */
export type Dimension<TElement> = readonly Predicate<readonly [TElement]>[];

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
export const property = <TElement>(key: keyof TElement): Func<Predicate<readonly [TElement]>, readonly [TElement[keyof TElement]]> =>
	value => element => element[key] === value;

export function pivot<TElement, TDimensions extends readonly [Dimension<TElement>, ...Dimension<TElement>[]]>(elements: readonly TElement[], ...[first, second, ...others]: TDimensions): Cube<TElement, TDimensions> {
	return (second ? slice(elements, first).map(vector => pivot(vector, second, ...others)) : slice(elements, first)) as Cube<TElement, TDimensions>;
}

// slices the data by one dimension
const slice = <TElement>(elements: readonly TElement[], dimension: Dimension<TElement>): TElement[][] =>
	dimension.map(predicate => fastFilter(elements, predicate));

/**
 * Queries data from a {@link Cube} using a selector {@link Func} to transform the elements in each cell into a result.
 * @typeParam TElement The type of the data within the {@link Cube}.
 * @typeParam TResult The type of value returned by the selector.
 * @param matrix The {@link Cube} to query data from.
 * @param selector A callback {@link Func} to create a result from each cell of the {@link Cube}.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = positions.map(property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = countries.map((country: string) => (player: Player) => player.country === country); // using a user-defined generator
 * 
 * const cube = pivot(squad, y, x);
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
export const query = <TElement, TResult>(matrix: TElement[][], selector: Func<TResult, readonly [TElement]>): TResult[][] =>
	matrix.map(vector => vector.map(selector));

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
export const sum = <TElement>(selector: Func<number, readonly [TElement]>): Func<number, readonly [TElement[]]> =>
	vector => vector.reduce((accumulator, element) => accumulator + selector(element), 0);

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
export const average = <TElement>(selector: Func<number, readonly [TElement]>): Func<number, readonly [TElement[]]> =>
	vector => sum(selector)(vector) / vector.length;

// fast alternative to Array.prototype.filter
function fastFilter<T>(array: readonly T[], predicate: Predicate<readonly [T]>): T[] {
	const result: T[] = [];

	for (let index = 0; index < array.length; ++index) {
		if (predicate(array[index])) {
			result.push(array[index]);
		}
	}

	return result;
}
