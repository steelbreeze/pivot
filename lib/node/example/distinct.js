"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = distinct;
/**
 * Function to pass into Array.prototype.filter to return unique values.
 */
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
