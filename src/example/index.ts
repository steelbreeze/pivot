import * as pivot from '../pivot';
import { squad } from './fulham';

// Calculate a person's age from their date of birth
function age(person: { dateOfBirth: Date }): number {
	return new Date(Date.now() - person.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// extract dimensions from the test data
const position = pivot.dimension(squad, 'position');
const country = pivot.dimension(squad, 'country', player => player.nationality);

// create axes out of the dimensions (note, you can use multiple dimensions in a single axis)
const x = pivot.axis(position);
const y = pivot.axis(country);

// create a pivot cube
const cube = pivot.pivot(squad, x, y);

// query data out of the cube
const result = pivot.select(cube, pivot.average(age));

// ugly code to pretty print the result with dimensions
console.log(`\t${position.map(pos => pos.value.substr(0,7)).join('\t')}`)
result.forEach((row, num) => console.log(`${country[num].value.substr(0,7)}\t${row.join('\t')}`));
