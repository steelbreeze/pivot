import * as pivot from '..';
import { Player, squad } from './fulham';

// the source of dimensions are just arrays of values
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const countries = squad.map(player => player.country).filter((value, index, source) => source.indexOf(value) === index).sort();

// create simple dimensions, referencing the atttribute within the source and the unique values they have
const x = pivot.dimension('position', positions);
const y = pivot.dimension('country', countries, criteria('country'));

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
console.log(result.map((row, index) => [y[index].metadata!.country, ...row].map(print).join('\t')).join('\n'));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}

function criteria<TRecord extends Record<pivot.Key, pivot.Value>>(key: pivot.Key) {
	return (value: pivot.Value) => Object.assign((record: TRecord) => record[key] === value, { metadata: Object.fromEntries([[key, value]]) });
}