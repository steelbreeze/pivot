import { Callback, Function, Pair } from '@steelbreeze/types';
/** The type of keys supported. */
export declare type Key = string | number;
/** The type of rows supported. */
export declare type Row = {
    [key in Key]: any;
};
/** A cirerion is one predicate that must resolve true for a row of data to be associated with one point on an axis. */
export interface Criterion<TRow extends Row> extends Pair {
    /** The predicate callback function used to perform the test. */
    predicate: Callback<TRow, boolean>;
}
/** The set of criterion used to select items for a row or column within a cube. */
export declare type Criteria<TRow extends Row> = Array<Criterion<TRow>>;
/** An dimension to pivot a table by; this is a set of criteria for the dimension. */
export declare type Dimension<TRow extends Row> = Array<Criteria<TRow>>;
/** A pair of axes to be used in a pivot operation. */
export interface Axes<TRow extends Row> {
    /** The x axis; columns in the resultant pivot table. */
    x: Dimension<TRow>;
    /** The y axis; rows in the resultant pivot table. */
    y: Dimension<TRow>;
}
/** A cube of data. */
export declare type Cube<TValue> = Array<Array<Array<TValue>>>;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export declare const distinct: <TRow extends Row>(table: TRow[], key: Key, getValue?: Callback<TRow, any>) => Array<any>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param criteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare const dimension: <TRow extends Row>(values: Array<any>, key: Key, criteria?: Callback<any, Criteria<TRow>>) => Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRow extends Row>(table: TRow[], axes: Axes<TRow>) => Cube<TRow>;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
 */
export declare const slice: <TRow extends Row>(dimension: Dimension<TRow>) => Function<TRow[], TRow[][]>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param cube The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRow, TResult>(cube: Cube<TRow>, selector: Callback<TRow[], TResult>) => TResult[][];
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export declare const filter: <TRow extends Row>(predicate: Callback<TRow, boolean>) => Callback<TRow[], TRow[]>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare const select: <TRow, TResult>(selector: Callback<TRow, TResult>) => Callback<TRow[], TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const sum: <TRow extends Row>(selector: Callback<TRow, number>) => Callback<TRow[], number>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 * @returns Returns a callback function that can be passed into the map function returning the average of the values for a cell or NaN if there are no values in that cell.
 */
export declare const average: <TRow extends Row>(selector: Callback<TRow, number>) => Callback<TRow[], number>;
