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
 * Creates a callback {@link Function} used in a map operation to create the {@link Predicate} for each point on a {@link Dimension} from a set of simple values.
 * @typeParam TValue The type of the source data that will be evaluated by this criteria.
 * @param key The property in the source data to base this {@link Predicate} on.
 * @example
 * The following code creates a {@link Dimension} that will be used to evaluate ```Player``` objects during a {@link pivot} operation based on the value of their ```position``` property:
 * ```ts
 * const positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
 * const dimension: Dimension<<Player> = positions.map(criteria('position'));
 * ```
 * See src/example/index.ts for a complete example.
 * @category Core API
 */
export declare const criteria: <TValue>(key: keyof TValue) => Function<TValue[keyof TValue], Predicate<TValue>>;
/**
 * @deprecated Pass at least one dimension to the pivot operation.
 * @hidden
 */
export declare function pivot<TValue>(source: Array<TValue>): Matrix<TValue>;
/**
 * Pivots source data by one {@link Dimension} returning a {@link Matrix}.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimension The {@link Dimension} used to pivot the source data by.
 * @example
 * The following code creates a {@link Matrix} of ```Player``` objects, pivoted by their ```position``` property:
 * ```ts
 * const dimension: Dimension<Player> = positions.map(criteria('position'));
 * const matrix: Matrix<Player> = pivot(squad, dimension);
 * ```
 * See src/example/index.ts for a complete example.
 * @category Core API
 */
export declare function pivot<TValue>(source: Array<TValue>, dimension: Dimension<TValue>): Matrix<TValue>;
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
 * const cube: Cube<Player> = pivot(squad, y, x);
 * ```
 * See src/example/index.ts for a complete example.
 * @category Core API
 */
export declare function pivot<TValue>(source: Array<TValue>, dimension1: Dimension<TValue>, dimension2: Dimension<TValue>): Cube<TValue>;
/**
 * Pivots source data by any number of {@link Dimension dimensions} returning a {@link Hypercube}.
 * @typeParam TValue The type of the source data.
 * @param source The source data, an array of objects.
 * @param dimensions The {@link Dimension dimensions} to pivot the source data by.
 * @returns Because of the arbitory number of {@link Dimension dimensions} that can be passed to this overload, the shape of the {@link Hypercube} cannot be known.
 * @example
 * The following code creates a {@link Hypercube}, pivoting the source data by three {@link Dimension dimensions} (though it can be any number):
 * ```ts
 * const hypercube: Hypercube = pivot(data, z, y, x);
 * ```
 * @category Core API
 */
export declare function pivot<TValue>(source: Array<TValue>, ...dimensions: Array<Dimension<TValue>>): Hypercube;
/**
 * Flattens a {@link Cube} into a {@link Matrix} using a selector {@link Function} to transform the objects in each cell of data in the {@link Cube} into a result.
 * @typeParam TValue The type of the data within the {@link Cube}.
 * @typeParam TResult The type of value returned by the selector.
 * @param cube The {@link Cube} to query data from.
 * @param selector A callback {@link Function} to create a result from each cell of the {@link Cube}.
 * @example
 * The following code flattens a {@link Cube}, returning the {@link average} age of players in a squad by country by position:
 * ```ts
 * const x: Dimension<Player> = positions.map(criteria('position'));
 * const y: Dimension<Player> = countries.map(criteria('country'));
 *
 * const cube: Cube<Player> = pivot(squad, y, x);
 *
 * const result: Matrix<number> = flatten(cube, average(age()));
 *
 * function age(asAt: Date = new Date()): Function<Player, number> {
 *   return player => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
 * }
 * ```
 * @category Cube query helpers
 */
export declare const flatten: <TValue, TResult>(cube: Cube<TValue>, selector: Function<TValue[], TResult>) => Matrix<TResult>;
/**
 * A generator, to create a function to pass into a cube map operation as the query parameter that sums numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
export declare const sum: <TValue>(selector: Function<TValue, number>) => Function<TValue[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @typeParam TValue The type of the data within the cube that will be passed into the selector.
 * @param selector A callback function to derive a numerical value for each object in the source data.
 * @category Cube query helpers
 */
export declare const average: <TValue>(selector: Function<TValue, number>) => Function<TValue[], number>;
