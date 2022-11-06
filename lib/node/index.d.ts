import { Callback, Function, Predicate as Criteria } from '@steelbreeze/types';
/** A dimension is a series of criteria used to partition data. */
export declare type Dimension<TRecord, TCriteria extends Criteria<TRecord>> = Array<TCriteria>;
/** A cube is a three dimensional data structure. */
export declare type Cube<TRecord> = Array<Array<Array<TRecord>>>;
/**
 * Create a callback to used in a map operation to create the criteria for each point on a dimension from a set of simple values.
 * @param key The property in the source data to base this criteria on.
 */
export declare const criteria: <TRecord>(key: keyof TRecord) => Function<TRecord[keyof TRecord], Criteria<TRecord>>;
/**
 * Pivots a table by two axes returning a cube.
 * @param records The source data, an array of records.
 * @param y The dimension to use for the y axis.
 * @param x The dimension to use for the x axis.
 */
export declare const cube: <TRecord, TCriteria extends Criteria<TRecord>>(records: TRecord[], y: Dimension<TRecord, TCriteria>, x: Dimension<TRecord, TCriteria>) => Cube<TRecord>;
/**
 * Queries data from a cube.
 * @param cube The source data, a matrix of records.
 * @param query A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRecord, TResult>(cube: Cube<TRecord>, query: Callback<TRecord[], TResult>) => TResult[][];
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export declare const sum: <TRecord>(selector: Function<TRecord, number>) => Function<TRecord[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each record in the source data.
 */
export declare const average: <TRecord>(selector: Function<TRecord, number>) => Function<TRecord[], number>;
