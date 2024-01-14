"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = void 0;
/**
 * Function to pass into Array.prototype.filter to return unique values.
 */
function distinct(value, index, source) {
    return source.indexOf(value) === index;
}
exports.distinct = distinct;
