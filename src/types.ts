/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A key and value of that key to use when slicing data in a pivot operation and the filter to evaluate it. */
export type Criterion<TRow, TValue> = { key: string | number, value: TValue, f: Func<TRow, boolean> };

/** A set of criterion representing a single dimension. */
export type Dimension<TRow, TValue> = Array<Criterion<TRow, TValue>>;

/** An axis on which to pivot source data; an axis is constructed from 1..n dimensions. */
export type Axis<TRow, TValue> = Array<Dimension<TRow, TValue>>;

/** A table of data. */
export type Table<TRow> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow> = Array<Array<Table<TRow>>>;
