import { average, axis, dimension, pivot, query } from '../pivot';
import { squad } from './fulham';

// Calculate a person's age from their date of birth
function age(person: { dateOfBirth: Date }): number {
	return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// create axes out of the dimensions (axis can be built from multiple dimensions)
const x = axis(dimension(squad, 'position'));
const y = axis(dimension(squad, 'country'));

// create the pivot cube
const cube = pivot(squad, y, x);

// find the average age of players by position by country
const result = query(cube, average(age));

// ugly code to pretty print the result with dimensions
const print = (value: any) => { const str = String(value || ''); return str.length < 8 ? str : (str.substr(0, 6) + '\u2026'); };
console.log(`\t${x.map(c => print(c.map(i => i.value).join(','))).join('\t')}`)
result.forEach((row, i) => console.log(`${print(y[i].map(j => j.value).join(','))}\t${row.map(print).join('\t')}`));
