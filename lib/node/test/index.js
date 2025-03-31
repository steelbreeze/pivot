"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const distinct_1 = require("../example/distinct");
var Nationality;
(function (Nationality) {
    Nationality["American"] = "American";
    Nationality["British"] = "British";
})(Nationality || (Nationality = {}));
const arnold = { name: 'Arnold', gender: 'male', age: 60, nationality: Nationality.American };
const emily = { name: 'Emily', gender: 'female', age: 67, nationality: Nationality.American };
const seamus = { name: 'Seamus', gender: 'male', age: 67, nationality: Nationality.British };
const eugene = { name: 'Eugene', gender: 'male', age: 75, nationality: Nationality.British };
const data = [arnold, emily, seamus, eugene];
// derive nationality and gender dimensions from the person data
const nationality = Object.values(Nationality).map((0, __1.property)('nationality'));
const gender = data.map(person => person.gender).filter(distinct_1.distinct).sort().map((0, __1.property)('gender'));
// a dimension to determine if someone is above or below retirement age
const retired = [
    (person) => person.age < 67,
    (person) => person.age >= 67,
];
// pivot by just one dimension
const matrix = (0, __1.pivot)(data, gender);
console.log(matrix[0][0] === emily);
console.log(matrix[1][0] === arnold);
console.log(matrix[1][1] === seamus);
console.log(matrix[1][2] === eugene);
// pivot by two dimensions
const cube = (0, __1.pivot)(data, gender, retired);
console.log(cube[0][1][0] === emily);
console.log(cube[1][0][0] === arnold);
console.log(cube[1][1][0] === seamus);
console.log(cube[1][1][1] === eugene);
// pivot by three dimensions
const ncube = (0, __1.pivot)(data, gender, retired, nationality);
console.log(ncube[0][1][0][0] === emily);
console.log(ncube[1][0][0][0] === arnold);
console.log(ncube[1][1][1][0] === seamus);
console.log(ncube[1][1][1][1] === eugene);
