import * as pivot from '..';

interface Data {
	i: number;
	j: number;
	k: number;
}

function test(scale: number): void {

	const data: Array<Data> = [];
	const x: pivot.Dimension<Data> = [];
	const y: pivot.Dimension<Data> = []

	console.time(`Create data with ${Math.pow(scale, 3)} records`);

	for (let i = 0; i < scale; i++) {
		for (let j = 0; j < scale; j++) {
			for (let k = 0; k < scale; k++) {
				data.push({ i, j, k });
			}
		}

		x.push(record => record.i === i);
		y.push(record => record.j === i);
	}

	console.timeEnd(`Create data with ${Math.pow(scale, 3)} records`);
	console.time('Create cube')

	pivot.pivot(data, y, x);

	console.timeEnd('Create cube')
}

test(100);
test(10);
test(1);