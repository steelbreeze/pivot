import { Cube, property, slice, pivot } from "..";
import { distinct } from "../example/distinct";

enum Nationality {
	American = "American",
	British = "British"
}

interface Person {
	name: string;
	gender: string;
	age: number; // TODO: derive age from date of birth
	nationality: Nationality;
}

const arnold: Person = { name: 'Arnold', gender: 'male', age: 60, nationality: Nationality.American };
const emily: Person = { name: 'Emily', gender: 'female', age: 67, nationality: Nationality.American };
const seamus: Person = { name: 'Seamus', gender: 'male', age: 67, nationality: Nationality.British };
const eugene: Person = { name: 'Eugene', gender: 'male', age: 75, nationality: Nationality.British };

const data: Array<Person> = [arnold, emily, seamus, eugene];

// derive nationality and gender dimensions from the person data
const nationality = Object.values(Nationality).map(property<Person>('nationality'));
const gender = data.map(person => person.gender).filter(distinct).sort().map(property<Person>('gender'));

// a dimension to determine if someone is above or below retirement age
const retired = [
	(person: Person) => person.age < 67,
	(person: Person) => person.age >= 67,
];

// pivot by just one dimension
const matrix = slice(data, gender);
console.log(matrix[0][0] === emily);
console.log(matrix[1][0] === arnold);
console.log(matrix[1][1] === seamus);
console.log(matrix[1][2] === eugene);

// pivot by two dimensions
const cube = pivot(data, gender, retired);
console.log(cube[0][1][0] === emily);
console.log(cube[1][0][0] === arnold);
console.log(cube[1][1][0] === seamus);
console.log(cube[1][1][1] === eugene);

// pivot by three dimensions
const ncube: Cube<Person[]> = pivot(data, gender, retired, nationality);
console.log(ncube[0][1][0][0] === emily);
console.log(ncube[1][0][0][0] === arnold);
console.log(ncube[1][1][1][0] === seamus);
console.log(ncube[1][1][1][1] === eugene);
