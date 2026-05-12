/**
 * A simple function, taking a variable number of arguments and returning a result.
 * @typeParam TResult The type of the result provided by the functions.
 * @typeParam TArgs The tuple type of the arguments passed into the function.
 * @category Type declarations
 */
export type Func<TResult, TArgs extends readonly unknown[] = []> = (...args: TArgs) => TResult;

/**
 * A predicate is a boolean function, used as a point on a {@link Dimension}
 * @typeParam TArgs The tuple type of the arguments passed to the predicate.
 * @category Type declarations
 */
export type Predicate<TArgs extends readonly unknown[] = []> = Func<boolean, TArgs>;
