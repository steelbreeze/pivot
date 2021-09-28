import { Player, squad } from './fulham';
import * as pivot from '..';

// create dimensions derived from the squad data
const axes = {
	x: pivot.deriveDimension(squad, 'position'),
	y: pivot.deriveDimension(squad, 'country')
};

// create the pivot cube from the squad data using position and country for x and y axes
const cube = pivot.cube(squad, axes);

// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));

// ugly code to pretty print the result with axes
console.log(`\t${axes.x.map(c => print(c.data[0].value)).join('\t')}`)
result.forEach((row, i) => console.log(`${print(axes.y[i].data[0].value)}\t${row.map(print).join('\t')}`));

// Calculate a person's age from their date of birth
function age(person: Player): number {
	return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substr(0, 6) + '\u2026');
}