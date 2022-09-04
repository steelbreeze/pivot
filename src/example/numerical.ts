import * as pivot from '..';

// a simple data set comprising 4 rows with some dimensional data
const data = [
	[1, 1, 'Row 1'],
	[2, 1, 'Row 2'],
	[1, 2, 'Row 3'],
	[2, 2, 'Row 4'],
	[2, 2, 'Row 5']
];

// create a dimension with pre-defined values for the first element in the data.
const x = pivot.dimension([1, 2, 3], 0);

// create a dimension with derived values for the second element in the data.
const y = pivot.dimension(pivot.distinct(data, row => row[1]), 1);

// create a cube from the data using the x and y dimensions
const cube = pivot.cube(data, x, y);

// Display the values of the third element seen in the data
console.log(pivot.map(cube, pivot.select(t => t[2])));
