/**
 * @module mongoDBTools
 * @author Hans-Peter Görg
 **/
const {endsWith} = require('lodash/string');
const { isInteger} = require('lodash/Lang');
const {ObjectId} = require('mongodb');

/**
 * Transforms the ref strings to mongodb ObjectIds
 * and the date strings to Date.
 *
 * _Pre-condition_ to use this utility is that when defining a schema for mongodb
 * the field names for references to other dependent_refs end with _ref (e.g. member_ref) and the field names for
 * fields with type date end with date (e.g. finishdate).
 *
 * @param {object } doc - document data for mongodb with object references as strings and dates as strings
 * @returns {object} document data for mongodb with ObjectId references and dates as date objects
 */
function transformForMongoDB(doc) {
    for (let key in doc) {
        let attribute = doc[key];
        if (typeof attribute === "object") {
            transformForMongoDB(attribute);
        } else {
            if (endsWith(key, '_ref')) {
                doc[key] = new ObjectId(attribute);
            } else if (endsWith(key, 'date')) {
                doc[key] = new Date(attribute);
            }
        }
    }
    return doc;
}

/**
 * checks if a string value can be converted to an integer and gives back the converted value if conversion was successful.
 *
 * @param value - the string value to convert
 * @returns {{couldBeConverted: boolean, convertedValue: number}} - return sub field _couldBeConverted_ is true, if conversion was
 * successful, otherwise false. Return sub field _convertedValue_ gives back the converted value, if conversion was successfull,
 * otherwise null
 */
function convertStringToMongodbInt(value) {
    let couldBeConverted = true;
    let convertedValue;

    if (isNaN(value)){
        couldBeConverted = false;
    } else {
        convertedValue = parseInt(value);
        if(! isInteger(convertedValue)) {
            couldBeConverted = false;
        } else if(convertedValue <= 0) {
            couldBeConverted = false;
        }
    }

    return {
        couldBeConverted: couldBeConverted,
        convertedValue: convertedValue
    };
}

exports.transformForMongoDB=transformForMongoDB;
exports.convertStringToMongodbInt=convertStringToMongodbInt;
