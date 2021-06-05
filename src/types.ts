/** A function taking one argument and returning a result. */
export type Func<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Func<TArg, boolean>;

/** The type of keys used throughout the library. */
export type Key = string | number;

export type Row<TValue, TKey extends Key> = { [T in TKey]: TValue };

/** A pair consiting of a key and value. */
export type Pair<TValue, TKey extends Key> = { key: TKey, value: TValue };

export type Axis<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<{ predicate: Predicate<TRow>, meta: Array<Pair<TValue, TKey>> }>;

/** A table of data. */
export type Table<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<TRow>;

/** A cube of data. */
export type Cube<TValue, TKey extends Key, TRow extends Row<TValue, TKey>> = Array<Array<Table<TValue, TKey, TRow>>>;