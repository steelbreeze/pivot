import * as pivot from '..';

// a simple data set comprising 4 rows with some dimensional data
const data = [
	{ a: 1, b: 1, c: 'Row 1' },
	{ a: 2, b: 1, c: 'Row 2' },
	{ a: 1, b: 2, c: 'Row 3' },
	{ a: 2, b: 2, c: 'Row 4' },
	{ a: 2, b: 2, c: 'Row 5' }
];

// create a dimension with pre-defined values for the property 'a' in the data.
const x = pivot.dimension('a', [1, 2, 3]);

// create a dimension with derived values for the property 'b' in the data.
const y = pivot.dimension('b', data.map(row => row.b).filter((value, index, source) => source.indexOf(value) === index));

// create a cube from the data using the x and y dimensions
const cube = pivot.cube(data, x, y);

// Display the values of 'c' seen in the data
console.log(pivot.map(cube, pivot.select(t => t.c)));
