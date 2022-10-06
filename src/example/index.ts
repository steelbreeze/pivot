import * as pivot from '..';
import { Player, squad } from './fulham';

const x = pivot.dimension('position', ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], label('position'));
const y = pivot.dimension('country', squad.map(player => player.country).filter((value, index, source) => source.indexOf(value) === index).sort(), label('country'));

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

// ugly code to pretty print the result with axes
console.log(`\t${x.map(c => print(c.metadata)).join('\t')}`);
result.forEach((row, i) => console.log(`${print(y[i].metadata)}\t${row.map(print).join('\t')}`));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}

function label<TRecord extends Record<pivot.Key, pivot.Value>>(key: pivot.Key) {
	return (value: pivot.Value) => Object.assign(
		(row: TRecord) => row[key] === value,
		{
			metadata: value
		});
}
