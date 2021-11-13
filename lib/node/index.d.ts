/** A function taking one argument and returning a result. */
export declare type Function<TArg, TResult> = (arg: TArg) => TResult;
/** A function taking one argument and returning a boolean result. */
export declare type Predicate<TArg> = Function<TArg, boolean>;
/** A two-dimensional array of values. */
export declare type Matrix<TValue> = Array<Array<TValue>>;
/** The type of values used in source data structures. */
export declare type Value = any;
/** The type of keys used to reference values in data structures. */
export declare type Key = Exclude<keyof Value, symbol>;
/** A set of attributes in a row of a table, each addressable via a key. */
export declare type Row = Record<Key, Value>;
/** A criterion used in the criteria of a dimension. */
export interface Criterion<TRow extends Row> {
    /** The key, or column name to test. */
    key: Key;
    /** The expected value. */
    value: Value;
    /** The predicate used to perform the test. */
    predicate: Predicate<TRow>;
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
/** A table of data. */
export declare type Table<TRow extends Row> = Array<TRow>;
/** A cube of data. */
export declare type Cube<TRow extends Row> = Matrix<Table<TRow>>;
/**
 * Function to pass into Array.prototype.filter to return only unique values.
 */
export declare const unique: <TValue>(value: TValue, index: number, array: TValue[]) => boolean;
/**
 * Returns a distinct list of values for a column of a table.
 * @param table The source data, a table of rows.
 * @param key The column name to find the distinct values for.
 * @param getValue An optional callback to derive values from the source data.
 * @returns Returns the distinct set of values for the key
 */
export declare const distinct: <TRow extends Row>(table: Table<TRow>, key: Key, getValue?: Function<TRow, any>) => Array<Value>;
/**
 * Creates a dimension from an array of values.
 * @param values A distinct list of values for the dimension.
 * @param key The name to give this dimension.
 * @param getCriteria An optional callback to build the dimensions criteria.
 * @returns Returns a simple dimension with a single criterion for each key/value combination.
 */
export declare const dimension: <TRow extends Row>(values: Array<Value>, key: Key, getCriteria?: Function<any, Criteria<TRow>>) => Dimension<TRow>;
/**
 * Pivots a table by two axes
 * @param table The source data, an array of rows.
 * @param axes The dimensions to use for the x and y axes.
 * @returns Returns an cube, being the source table split by the criteria of the dimensions used for the x and y axes.
 */
export declare const cube: <TRow extends Row>(table: Table<TRow>, axes: Axes<TRow>) => Cube<TRow>;
/**
 * Generates a function to slice data by the criteria specified in a dimension.
 * @param dimension The dimension to generate the slicer for.
 * @returns Returns a function that will take a table and slice it into an array of tables each conforming to the criteria of a point on a dimension.
  */
export declare const slice: <TRow extends Row>(dimension: Dimension<TRow>) => Function<Table<TRow>, Table<TRow>[]>;
/**
 * Queries data from a cube, or any matrix structure.
 * @param source The source data.
 * @param selector A callback function to create a result from each cell of the cube.
 */
export declare const map: <TRow extends Row, TResult>(source: Cube<TRow>, selector: Function<Table<TRow>, TResult>) => Matrix<TResult>;
/**
 * A generator, used to filter data within a cube.
 * @param predicate A predicate to test a row of data to see if it should be included in the filter results.
 */
export declare const filter: <TRow extends Row>(predicate: Predicate<TRow>) => Function<Table<TRow>, Table<TRow>>;
/**
 * A generator, used to transform the source data in a cube to another representation.
 * @param selector A function to transform a source record into the desired result.
 */
export declare const select: <TRow extends Row, TResult>(selector: Function<TRow, TResult>) => Function<Table<TRow>, TResult[]>;
/**
 * A generator, to create a function to pass into query that sums numerical values derived from rows in a cube.
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const sum: <TRow extends Row>(selector: Function<TRow, number>) => Function<Table<TRow>, number | null>;
/**
 * A generator, to create a function to pass into query that averages numerical values derived from rows in a cube .
 * @param selector A callback function to derive a numerical value for each row.
 */
export declare const average: <TRow extends Row>(selector: Function<TRow, number>) => Function<Table<TRow>, number | null>;
/**
 * Counts the number of items in a table.
 * @param table The source table.
 */
export declare const count: <TRow extends Row>(table: Table<TRow>) => number | null;
