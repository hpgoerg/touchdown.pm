/**
 * @module generalUtils
 *
 * @description
 * general utils for objects
 *
 * @author Hans-Peter Görg
 **/

const {isInteger} = require('lodash/Lang');
const {NO_VALUE} = require('../constants/enums');

/**
 * utility to check if an object is undefined or null
 *
 * @param object - the object to check
 * @returns {boolean} - true: object is undefined or null, false: object is _not_ undefined and _not_ null
 */
function isNotSet(object) {
    return (!isSet(object));
}

/**
 * utility to check if an object is _not_ undefined and is _not_ null
 *
 * @param object - the object to check
 * @returns {boolean} - true: object isSet, false: object is not set (is undefined or null)
 */
function isSet(object) {
    return ((typeof object !== 'undefined') && (object !== null) && (object !== NO_VALUE));
}

/**
 * checks if a string value can be converted to an integer and gives back the converted value if conversion was successful.
 *
 * @param value - the string value to convert
 * @returns {{couldBeConverted: boolean, convertedValue: number}} - return sub field _couldBeConverted_ is true, if conversion was
 * successful, otherwise false. Return sub field _convertedValue_ gives back the converted value, if conversion was successfull,
 * otherwise null
 */
function convertToPositiveInt(value) {
    let couldBeConverted = true;
    let convertedValue;

    if (isNaN(value)){
        couldBeConverted = false;
    } else {
        convertedValue = parseInt(value);
        if(! isInteger(convertedValue)) {
            couldBeConverted = false;
        } else if(convertedValue < 0) {
            couldBeConverted = false;
        }
    }

    return {
        couldBeConverted: couldBeConverted,
        convertedValue: convertedValue
    };
}

exports.isNotSet = isNotSet;
exports.isSet = isSet;
exports.convertToPositiveInt = convertToPositiveInt;
