"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = exports.sum = exports.query = exports.pivot = exports.property = exports.dimension = void 0;
const dimension = (source, generator) => source.map(generator);
exports.dimension = dimension;
const property = (key) => (criterion) => (value) => value[key] === criterion;
exports.property = property;
const pivot = (source, ...[first, second, ...others]) => {
    const matrix = first.map((predicate) => source.filter(predicate));
    return second ? matrix.map((slice) => (0, exports.pivot)(slice, second, ...others)) : matrix;
};
exports.pivot = pivot;
const query = (matrix, selector) => matrix.map((slice) => slice.map(selector));
exports.query = query;
const sum = (selector) => (source) => source.reduce((a, b) => a + selector(b), 0);
exports.sum = sum;
const average = (selector) => (source) => (0, exports.sum)(selector)(source) / source.length;
exports.average = average;
