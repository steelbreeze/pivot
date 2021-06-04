/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

export type Predicate<TArg> = Func<TArg, boolean>;

export type Key = string | number;

/** A pair consiting of a key and value. */
export type Pair<TValue> = { key: Key, value: TValue };

export type Axis<TRow, TMeta> = Array<{ predicate: Predicate<TRow>, meta: TMeta }>;

/** A table of data. */
export type Table<TRow> = Array<TRow>;

/** A cube of data. */
export type Cube<TRow> = Array<Array<Table<TRow>>>;