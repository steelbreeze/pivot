import { criteria, pivot, aggregate, average } from '..';
import { Player, squad } from './fulham';
import { distinct } from './distinct';

// the position dimension we want in a defined order
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

// the countries dimension we derive from the squad data and order alphabetically
const countries = squad.map(player => player.country).filter(distinct).sort();

// we then create dimensions which also reference a property in the source data 
const x = positions.map(criteria('position'));
const y = countries.map(criteria('country'));

// create the pivot cube from the squad data using position and country for x and y axes
const cube = pivot(squad, y, x);

// find the average age of players by position by country as at 2021-05-23
const result = aggregate(cube, average(age(new Date('2021-05-23'))));

// Creates a callback to calculate a players age from their date of birth as at a given date
function age(asAt: Date = new Date()) {
	return (player: Player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [countries[index], ...row].map(print).join('\t')).join('\n'));

//console.log(partition(squad, x));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
