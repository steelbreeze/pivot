import * as pivot from '..';
import { Player, squad} from './fulham';
import { Function, Pair, Predicate } from '@steelbreeze/types';

// the source of dimensions are just arrays of values
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const countries = squad.map(player => player.country).filter(distinct).sort();

// create simple dimensions, referencing the atttribute within the source and the unique values they have
const x = positions.map(pivot.criteria<Player>('position'));
const y = countries.map(customCriteria<Player>('country'));

console.time('Cube creation');

// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(squad, y, x);

console.timeEnd('Cube creation');

// find the average age of players by position by country as at 2021-05-23
const result = pivot.map(cube, pivot.average(age(new Date('2021-05-23'))));

// Creates a callback to calculate a players age from their date of birth as at a given date
function age(asAt: Date): (person: { dateOfBirth: Date }) => number {
	return (player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [y[index].value, ...row].map(print).join('\t')).join('\n'));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}

// function to create a filter that return only distinct values from an array
function distinct<T>(value: T, index: number, source: Array<T>): boolean {
	return source.indexOf(value) === index;
}

// build a custom criteria that will label criteria with the key and value that are checked
function customCriteria<TRecord>(key: keyof TRecord): Function<TRecord[keyof TRecord], Predicate<TRecord> & Pair<keyof TRecord, TRecord[keyof TRecord]>> {
	return value => Object.assign((record: TRecord) => record[key] === value, { key, value });
}