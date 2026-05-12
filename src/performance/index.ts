import { Dimension, pivot } from '..';

interface Data {
	i: number;
	j: number;
	k: number;
}

function test(scale: number): void {

	const data: Array<Data> = [];
	const dimensionData: number[] = [];

	for (let i = 0; i < scale; i++) {
		for (let j = 0; j < scale; j++) {
			for (let k = 0; k < scale; k++) {
				data.push({ i, j, k });
			}
		}

		dimensionData.push(i);
	}

	const x: Dimension<Data> = dimensionData.map(value => element => element.i === value);
	const y: Dimension<Data> = dimensionData.map(value => element => element.j === value);

	const start = performance.now();

	pivot(data, y, x);

	const end = performance.now();
	console.log(`Create cube with ${Math.pow(scale, 3)} records: ${Math.round((end - start) * 1000) / 1000}ms`);
}

test(1);
test(10);
test(100);