/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Func<TArg, boolean>;

export type Key = string | number;

/** A pair consiting of a key and value. */
export type Pair<TValue, TKey extends Key> = { key: TKey, value: TValue };

export type Axis<TRow, TMeta = any> = Array<{ predicate: Predicate<TRow>, meta: TMeta }>;

/** A table of data. */
export type Table<TRow> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow> = Array<Array<Table<TRow>>>;