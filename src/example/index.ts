import * as pivot from '..';
import { Player, squad } from './fulham';

// create axes derived from the squad data
const x = pivot.axis.fromTable(squad, 'position');
const y = pivot.axis.fromTable(squad, 'country', player => player.country.substr(0,3).toUpperCase());

// create the pivot cube
const cube = pivot.cube(squad, y, x);

// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));

// ugly code to pretty print the result with axes
console.log(`\t${x.map(c => print(c.pairs[0].value)).join('\t')}`)
result.forEach((row, i) => console.log(`${print(y[i].pairs[0].value)}\t${row.map(print).join('\t')}`));

// Calculate a person's age from their date of birth
function age(person: Player): number {
	return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');
	
	return str.length < 8 ? str : (str.substr(0, 6) + '\u2026');
}