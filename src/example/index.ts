import * as pivot from '..';
import { Player, squad } from './fulham';
import { Callback, Pair, Predicate } from '@steelbreeze/types';

// The keys into the player type
type Keys = keyof Player;

// critera for a dimension with a little associated metadata
type Criteria = Predicate<Player> & Pair<keyof Player, Player[keyof Player]>;

// the source of dimensions are just arrays of values
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const countries = squad.map(player => player.country).filter(distinct).sort();

// create simple dimensions, referencing the atttribute within the source and the unique values they have
const x = positions.map(pivot.criteria('position'));
const y = countries.map(criteriaWithMeta('country'));

console.time('Cube creation');

// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(squad, y, x);

console.timeEnd('Cube creation');

// find the average age of players by position by country as at 2021-05-23
const result = pivot.map(cube, pivot.average(age(new Date('2021-05-23'))));

// Creates a callback to calculate a players age from their date of birth as at a given date
function age(asAt: Date): (player: Player) => number {
	return (player: Player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [y[index].value, ...row].map(print).join('\t')).join('\n'));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}

// build a custom criteria that will label criteria with the key/value
function criteriaWithMeta(key: Keys): Callback<Player[Keys], Criteria> {
	return (value: Player[Keys]) => Object.assign((player: Player) => player[key] === value, { key, value });
}

// function to create a filter that return only distinct values from an array
function distinct<T>(value: T, index: number, source: Array<T>): boolean {
	return source.indexOf(value) === index;
}