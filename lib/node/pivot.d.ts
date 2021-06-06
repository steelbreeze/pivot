import { Axis, Cube, Func, Key, Row, Table } from './types';
/**
 * Creates an axis based on the contents of a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this axis.
 * @param f An optional callback function to derive values from the source table objects. If omitted, the object attribute with the same name as the key is derived.
 * @param s An optional callback function used to sort the values of the dimension. This conforms to the sort criteria used by Array.prototype.sort.
 */
export declare function axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, key: TKey, f?: Func<TRow, TValue>, s?: (a: TValue, b: TValue) => number): Axis<TValue, TKey, TRow>;
export declare namespace axis {
    var make: <TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(source: TValue[], key: TKey, f?: Func<TRow, TValue>) => Axis<TValue, TKey, TRow>;
    var join: <TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(axis1: Axis<TValue, TKey, TRow>, axis2: Axis<TValue, TKey, TRow>) => Axis<TValue, TKey, TRow>;
}
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
export declare function pivot<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(table: Table<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): Cube<TValue, TKey, TRow>;
export declare function compact<TValue, TKey extends Key, TRow extends Row<TValue, TKey>>(cube: Cube<TValue, TKey, TRow>, y: Axis<TValue, TKey, TRow>, x: Axis<TValue, TKey, TRow>): void;
/**
 * Returns data queried from a cube as a table.
 * @param cube The source cube.
 * @param f A callback function to create a result from each cell of the cube.
 */
export declare function query<TValue, TKey extends Key, TRow extends Row<TValue, TKey>, TResult>(cube: Cube<TValue, TKey, TRow>, f: Func<Table<TValue, TKey, TRow>, TResult>): Array<Array<TResult>>;
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
