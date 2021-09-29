/** A function taking one argument and returning a result. */
export declare type Func1<TArg1, TResult> = (arg: TArg1) => TResult;
/** A function taking two arguments and returning a result. */
export declare type Func2<TArg1, TArg2, TResult> = (arg1: TArg1, arg2: TArg2) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Func1<TArg, boolean>;
/** A set of attributes in a row of a table, each addressable via a key. */
export interface Row {
    [key: string]: any;
}
/** A table of data. */
export declare type Table<TRow extends Row> = Array<TRow>;
/** A criterion used to test rows of data against. */
export interface Criterion<TRow extends Row> {
    /** The key, or column name to test. */
    key: string;
    /** The expected value. */
    value: any;
    /**
     * A predicate used to evaluate the criterion.
     * @hidden
     */
    f: Predicate<TRow>;
}
/** An dimension to pivot a table by. */
export declare type Dimension<TRow extends Row> = Array<Array<Criterion<TRow>>>;
/** A pair of axes */
export interface Axes<TRow extends Row> {
    /** The x axis; columns in the resultant pivot table. */
    x: Dimension<TRow>;
    /** The y axis; rows in the resultant pivot table. */
    y: Dimension<TRow>;
}
/** A cube of data. */
export declare type Cube<TRow extends Row> = Array<Array<Table<TRow>>>;
/** Options passed into the deriveDimension function. */
export interface Options<TRow extends Row> {
    /** An optional user-defined function to derive a value from the source data to be used in the dimension. */
    get?: Func1<TRow, any>;
    /** An optional user-defined function to determin the ordering of the dimension. */
    sort?: Func2<any, any, number>;
}
/**
 * Creates a dimension from an array of values.
 * @param values The source values.
 * @param key The name to give this dimension.
 * @param get An optional callback function used to convert values in the source table to those in the dimension when pivoting.
 */
export declare function dimension<TRow extends Row>(values: Array<any>, key: string, get?: Func1<TRow, any>): Dimension<TRow>;
/**
 * Creates a derived dimension based on the contents of column in a table.
 * @param table The source table, an array of objects.
 * @param key The name to give this dimension.
 * @param options An optional structure, containing two configuration parameters: get, a callback function used to convert values in the source table to those in the dimension when pivoting; sort, a method used to sort the values in the axis.
 */
export declare function deriveDimension<TRow extends Row>(table: Table<TRow>, key: string, options?: Options<TRow>): Dimension<TRow>;
/**
 * Join dimensions together.
 * @param dimensions The dimensions to combine into one
 */
export declare function join<TRow extends Row>(...dimensions: Array<Dimension<TRow>>): Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 */
export declare function cube<TRow extends Row>(table: Table<TRow>, axes: Axes<TRow>): Cube<TRow>;
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
export declare function select<TRow extends Row, TResult>(selector: Func1<TRow, TResult>): Func1<Table<TRow>, Array<TResult>>;
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
