/**
 * Function to pass into Array.prototype.filter to return unique values.
 */
export function distinct<TValue>(value: TValue, index: number, source: Array<TValue>): boolean {
	return source.indexOf(value) === index;
}
