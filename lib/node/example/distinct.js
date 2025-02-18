"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = distinct;
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
