/** A function taking one argument and returning a result. */
export declare type Func<TArg, TResult> = (arg: TArg) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Func<TArg, boolean>;
/** A two-dimensional array of values. */
export declare type Matrix<TValue> = Array<Array<TValue>>;
/** The type of values used in source data structures. */
export declare type Value = any;
/** The type of keys used to reference values in data structures. */
export declare type Key = Exclude<keyof Value, symbol>;
/** A set of attributes in a row of a table, each addressable via a key. */
export declare type Row = Record<Key, Value>;
/** A key and value for that key. */
export interface Pair {
    /** The key, or column name to test. */
    key: Key;
    /** The expected value. */
    value: Value;
}
/** An dimension to pivot a table by. */
export declare type Dimension<TRow extends Row> = Array<Array<Predicate<TRow> & Pair>>;
/** A pair of axes to be used in a pivot operation. */
export interface Axes<TRow extends Row> {
    /** The x axis; columns in the resultant pivot table. */
    x: Dimension<TRow>;
    /** The y axis; rows in the resultant pivot table. */
    y: Dimension<TRow>;
}
/** A table of data. */
export declare type Table<TRow extends Row> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow extends Row> = Matrix<Table<TRow>>;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export declare function distinct<TRow extends Row>(table: Table<TRow>, key: Key, getValue?: Func<TRow, Value>): Array<Value>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare function dimension<TRow extends Row>(values: Array<Value>, key: Key, getValue?: Func<TRow, Value>): Dimension<TRow>;
/**
 * Create a composite dimension from others. This creates a cartesian product of the source dimensions criteria.
 * @param dimensions An array of dimensions to combine into one.
 * @returns Returns a complex dimension with criteria being the cartesian product of the source dimensions.
 */
export declare function join<TRow extends Row>(...dimensions: Array<Dimension<TRow>>): Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare function cube<TRow extends Row>(table: Table<TRow>, axes: Axes<TRow>): Cube<TRow>;
/**
 * Slices data by the criteria specified in a dimension.
 * @param table The source table, an array of objects.
 * @param dimension A dimension to slice the source table by.
 * @returns A set of tables, filtered by the dimensions criteria.
 */
export declare function slice<TRow extends Row>(table: Table<TRow>, dimension: Dimension<TRow>): Array<Table<TRow>>;
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 * @returns Returns a copy of the cube, with the contents of each cell filtered by the predicate.
 */
export declare function filter<TRow extends Row>(cube: Cube<TRow>, predicate: Predicate<TRow>): Cube<TRow>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare function map<TSource, TResult>(source: Matrix<TSource>, selector: Func<TSource, TResult>): Matrix<TResult>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare function select<TRow extends Row, TResult>(selector: Func<TRow, TResult>): Func<Table<TRow>, Array<TResult>>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare function sum<TRow extends Row>(selector: Func<TRow, number>): Func<Table<TRow>, number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare function average<TRow extends Row>(selector: Func<TRow, number>): Func<Table<TRow>, number | null>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare function count<TRow extends Row>(table: Table<TRow>): number | null;
