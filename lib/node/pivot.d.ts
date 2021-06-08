import { Axis, Cube, Func, Key, Row, Table } from './types';
export declare namespace axis {
    /**
     * Creates an axis based on the contents of a table.
     * @param table The source table, an array of objects.
     * @param key The name to give this axis.
     * @param f An optional callback function to derive values from the source table objects. If omitted, the object attribute with the same name as the key is derived.
     * @param s An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
     */
    function fromTable<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, key: TKey, f?: Func<TRow, TValue>, s?: (a: TValue, b: TValue) => number): Axis<TValue, TKey, TRow>;
    /**
     * Creates an axis from an array of values.
     * @param values The source values.
     * @param key The name to give this dimension.
     * @param f An optional callback function used to convert values in the source table to those in the dimension when pivoting.
     */
    function fromValues<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(values: Array<TValue>, key: TKey, f?: Func<TRow, TValue>): Axis<TValue, TKey, TRow>;
    /**
     * Merge two axes together into a single axis.
     * @param axis1 The first axis.
     * @param axis2 The second axis.
     */
    function combine<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(axis1: Axis<TValue, TKey, TRow>, axis2: Axis<TValue, TKey, TRow>): Axis<TValue, TKey, TRow>;
}
/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
export declare function slice<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, axis: Axis<TValue, TKey, TRow>): Array<Table<TValue, TKey, TRow>>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
export declare function cube<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): Cube<TValue, TKey, TRow>;
/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 * @param p A predicate to call on rows to filter the cube prior to
 */
export declare function query<TValue, TKey extends Key, TRow extends Row<TValue, TKey>, TResult>(cube: Cube<TValue, TKey, TRow>, f: Func<Table<TValue, TKey, TRow>, TResult>, p?: Func<TRow, boolean>): Array<Array<TResult>>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare function count<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>): number | null;
/**
 *  generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function sum<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(f: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param f A callback function to derive a numerical value for each row.
 */
export declare function average<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(f: Func<TRow, number>): Func<Table<TValue, TKey, TRow>, number | null>;
