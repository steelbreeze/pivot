import { Callback, Function, Predicate } from '@steelbreeze/types';
/** A matrix is a two-dimensional data structure. */
export declare type Matrix<TRecord> = Array<Array<TRecord>>;
/** A cube of data. */
export declare type Cube<TRecord> = Matrix<Array<TRecord>>;
/** Create a callback used in a map operation to create the criteria for each point on a dimension.
 * @param key The property in the source data to base this criteria on.
 * @remarks Use a bespoke version of this function if custom criteria that includes metadata is required.
 */
export declare const criteria: <TRecord>(key: keyof TRecord) => Callback<TRecord[keyof TRecord], Predicate<TRecord>>;
/**
 * Pivots a table by two axes
 * @param source The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRecord>(source: TRecord[], y: Predicate<TRecord>[], x: Predicate<TRecord>[]) => Cube<TRecord>;
/**
 * Queries data from a cube.
 * @param source The source data, a matrix of records.
 * @param mapper A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRecord, TResult>(source: Matrix<TRecord>, mapper: Callback<TRecord, TResult>) => Matrix<TResult>;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test source data to see if it should be included in the filter results.
 */
export declare const filter: <TRecord>(predicate: Predicate<TRecord>) => Function<TRecord[], TRecord[]>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare const select: <TRecord, TResult>(selector: Callback<TRecord, TResult>) => Function<TRecord[], TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export declare const sum: <TRecord>(selector: Function<TRecord, number>) => Function<TRecord[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export declare const average: <TRecord>(selector: Function<TRecord, number>) => Function<TRecord[], number>;
