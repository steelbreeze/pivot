/** A function taking one argument and returning a result. */
export declare type Func1<TArg1, TResult> = (arg: TArg1) => TResult;
/** A function taking two arguments and returning a result. */
export declare type Func2<TArg1, TArg2, TResult> = (arg1: TArg1, arg2: TArg2) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Func1<TArg, boolean>;
/** A set of attributes, each entry addressable via a key. */
export declare type Row = {
    [key: string]: any;
};
/** A pair consiting of a key and value. */
export declare type Pair = {
    key: string;
    value: any;
};
export declare type Axis<TRow extends Row> = Array<{
    p: Predicate<TRow>;
    pairs: Array<Pair>;
}>;
/** A table of data. */
export declare type Table<TRow extends Row> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow extends Row> = Array<Array<Table<TRow>>>;
/** Static class acting as a namespace for axis related functions. */
export declare class axis {
    /**
     * Creates an axis based on the contents of a table.
     * @param table The source table, an array of objects.
     * @param key The name to give this axis.
     * @param options An optional get callback to derive the axis values for a row, and a sort callback.
     */
    static fromTable<TRow extends Row>(table: Table<TRow>, key: string, options?: {
        get?: Func1<TRow, string>;
        sort?: Func2<any, any, number>;
    }): Axis<TRow>;
    /**
     * Creates an axis from an array of values.
     * @param values The source values.
     * @param key The name to give this dimension.
     * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
     */
    static fromValues<TRow extends Row>(values: Array<any>, key: string, get?: Func1<TRow, string>): Axis<TRow>;
    /**
     * Merge two axes together into a single axis.
     * @param axis1 The first axis.
     * @param axis2 The second axis.
     */
    static join<TRow extends Row>(axis1: Axis<TRow>, axis2: Axis<TRow>): Axis<TRow>;
}
/**
 * Slices a table based on the critera specified by an axis.
 * @param table The source data, an array of rows.
 * @param axis The result of a call to axis with one or more dimensions.
 */
export declare function slice<TRow extends Row>(table: Table<TRow>, axis: Axis<TRow>): Array<Table<TRow>>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param y The first axis to pivot the table by.
 * @param x The second axis to pivot the table by.
 */
export declare function cube<TRow extends Row>(table: Table<TRow>, y: Axis<TRow>, x: Axis<TRow>): Cube<TRow>;
/**
 * Filters data within a cube.
 * @param cube The source cube.
 * @param predicate A predicate to filter the cube by.
 */
export declare function filter<TRow extends Row>(cube: Cube<TRow>, predicate: Predicate<TRow>): Cube<TRow>;
/**
 * Queries data from a cube.
 * @param cube The source cube.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare function map<TRow extends Row, TResult>(cube: Cube<TRow>, selector: Func1<Table<TRow>, TResult>): Array<Array<TResult>>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare function select<TRow extends Row, TResult>(selector: Func1<TRow, TResult>): Func1<Table<TRow>, TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare function sum<TRow extends Row>(selector: Func1<TRow, number>): Func1<Table<TRow>, number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare function average<TRow extends Row>(selector: Func1<TRow, number>): Func1<Table<TRow>, number | null>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare function count<TRow extends Row>(table: Table<TRow>): number | null;
