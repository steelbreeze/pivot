import { dimension, property, pivot, query, average } from '..';
import { Player, squad } from './fulham';
import { distinct } from './distinct';

const baseDate = new Date('2021-05-23');

const yearDiff = (date1: Date, date2: Date) => new Date(date1.getTime() - date2.getTime()).getUTCFullYear() - 1970

// calculates a players age from their date of birth as at a given date
const age = (player: Player) => yearDiff(baseDate, player.dateOfBirth);

// the position dimension we want in a defined order
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

// the countries dimension we derive from the squad data and order alphabetically
const countries = squad.map(player => player.country).filter(distinct).sort();

// we then create dimensions which also reference a property in the source data 
const x = dimension(positions, property<Player>('position')); // using the built-in dimension generator matching a property
const y = dimension(countries, (country: string) => (player: Player) => player.country === country); // using a user-defined generator

// create the pivot cube from the squad data using position and country for x and y axes
const cube = pivot(squad, y, x);

// find the average age of players by position by country as at 2021-05-23
const result = query(cube, average(age));

// pretty print the result with axes
console.log(`\t${positions.map(print).join('\t')}`);
console.log(result.map((row, index) => [countries[index], ...row].map(print).join('\t')).join('\n'));

// Print a value in 7 characters and truncate with ellipsis
function print(value: any) {
	const str = String(value || '');

	return str.length < 8 ? str : (str.substring(0, 6) + '\u2026');
}
