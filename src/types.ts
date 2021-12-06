/** A function taking one argument and returning a result. */
export type Function<TArg, TResult> = (arg: TArg) => TResult;

/** A function taking one argument and returning a boolean result. */
export type Predicate<TArg> = Function<TArg, boolean>;

/** A key/value pair. */
export interface Pair<TValue = any, TKey = keyof TValue> {
	/** The key. */
	key: TKey;

	/** The value. */
	value: TValue;
}
