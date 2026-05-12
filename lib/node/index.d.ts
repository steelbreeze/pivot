/**
 * A minimal library for pivoting data by 1-n dimensions.
 *
 * The {@link pivot} function slices and dices data by one or more {@link Dimension dimensions}, returning a {@link Matrix} if one {@link Dimension} is passed, a {@link Cube} if two
 * {@link Dimension dimensions} are passed, and a {@link Hypercube} if more than two {@link Dimension dimensions} are passed.
 *
 * Simple {@link Dimension dimensions} can be created by mapping a set of values using the {@link dimension} and {@link property} functions.
 *
 * Once a {@link Cube} is created, the {@link query} function can be used to perform query operations on the subset of the source data in each cell.
 *
 * @module
 */
import { Func, Predicate } from "./types";
/**
 * A dimension is a set of {@link Predicate} used to partition data.
 * @typeParam TElement The type of the source data that the {@link Dimension} was created for.
 * @category Type declarations
 */
export type Dimension<TElement> = Predicate<readonly [TElement]>[];
/**
 * A Matrix is a two-dimensional data structure.
 * @typeParam TElement The type of the elements within the Matrix.
 * @category Type declarations
 */
export type Matrix<TElement> = TElement[][];
/**
 * A cube is a three-dimensional data structure.
 * @typeParam TElement The type of the elements within the Cube.
 * @category Type declarations
 */
export type Cube<TElement> = Matrix<TElement>[];
/**
 * A Hypercube is a data structure with at least four dimensions.
 * @typeParam TElement The type of the elements within the Hypercube.
 * @category Type declarations
 */
export type Hypercube<TElement> = Cube<TElement>[] | Hypercube<TElement>[];
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
export declare const property: <TElement>(key: keyof TElement) => Func<Predicate<readonly [TElement]>, readonly [TElement[keyof TElement]]>;
/**
 * Slices data by one dimension, returning a {@link Matrix}.
 * @typeParam TElement The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param dimension The first dimension to slice the data by.
 * @category Cube building
 */
export declare function pivot<TElement>(elements: readonly TElement[], dimension: Dimension<TElement>): Matrix<TElement>;
/**
 * Slices data by two dimensions, returning a {@link Cube}.
 * @typeParam TElement The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param first The first dimension to slice the data by.
 * @param second The second dimension to dice the data by.
 * @category Cube building
 */
export declare function pivot<TElement>(elements: readonly TElement[], first: Dimension<TElement>, second: Dimension<TElement>): Cube<TElement>;
/**
 * Slices data by an arbitory number of dimensions, returning a {@link Hypercube}.
 * @typeParam TElement The type of the source data to be sliced and diced.
 * @param elements The source data, an array of objects.
 * @param first The first dimension to slice the data by.
 * @param second The second dimension to dice the data by.
 * @param others Two or more other dimensions to pivot the data by.
 * @category Cube building
 */
export declare function pivot<TElement>(elements: readonly TElement[], first: Dimension<TElement>, ...[second, ...others]: readonly Dimension<TElement>[]): Hypercube<TElement>;
/**
 * Queries data from a {@link Matrix} using a selector {@link Func} to transform the objects in each cell of data in the {@link Matrix} into a result.
 * @typeParam TElement The type of the data within the {@link Matrix}.
 * @typeParam TResult The type of value returned by the selector.
 * @param matrix The {@link Matrix} to query data from.
 * @param selector A callback {@link Func} to create a result from each cell of the {@link Cube}.
 * @remarks The {@link Matrix} may also be a {@link Cube} or {@link Hypercube}.
 * @example
 * The following code queries a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x = positions.map(property<Player>('position')); // using the built-in dimension generator matching a property
 * const y = countries.map((country: string) => (player: Player) => player.country === country); // using a user-defined generator
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
export declare const query: <TElement, TResult>(matrix: Matrix<TElement>, selector: Func<TResult, readonly [TElement]>) => Matrix<TResult>;
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
 * const result: Matrix<number> = query(cube, sum(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
export declare const sum: <TElement>(selector: Func<number, readonly [TElement]>) => Func<number, readonly [TElement[]]>;
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
 * const result: Matrix<number> = query(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Func<number, readonly [Player]> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * See {@link https://github.com/steelbreeze/pivot/blob/main/src/example/index.ts GitHub} for a complete example.
 * @category Cube query
 */
export declare const average: <TElement>(selector: Func<number, readonly [TElement]>) => Func<number, readonly [TElement[]]>;
