import { Dimension, pivot } from '..';

interface Data {
	i: number;
	j: number;
	k: number;
}

function test(scale: number): void {

	const data: Array<Data> = [];
	const x: Dimension<Data> = [];
	const y: Dimension<Data> = []

//	const t1 = `Create data with ${Math.pow(scale, 3)} records`;
	const t2 = `Create cube with ${Math.pow(scale, 3)} records`;

//	console.time(t1);

	for (let i = 0; i < scale; i++) {
		for (let j = 0; j < scale; j++) {
			for (let k = 0; k < scale; k++) {
				data.push({ i, j, k });
			}
		}

		x.push(record => record.i === i);
		y.push(record => record.j === i);
	}

//	console.timeEnd(t1);
	console.time(t2)

	pivot(data, y, x);

	console.timeEnd(t2)
}

test(100);
test(10);
test(1);