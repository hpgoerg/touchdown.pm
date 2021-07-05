/**
 * @module schemaValidator
 * @author Hans-Peter Görg
 **/

const {Validator} = require('jsonschema');

function validateSchema(obj, schema) {
    let validator = new Validator();
    let result = validator.validate(obj, schema);

    let isValid = true;
    let errorMessages = [];

    if (result.errors.length > 0) {
        for (let i = 0; i < result.errors.length; i++) {
            let name = result.errors[i].name;
            let argument = result.errors[i].argument;

            if ((name === 'required') && (argument === 'version')) {
                //ignore error: versions are set by create- and update-Methods
            } else {
                errorMessages.push(result.errors[i].message);
            }
        }
    }

    if(errorMessages.length > 0) {
        isValid = false;
    }
    return {
        isValid: isValid,
        errorMessages: errorMessages
    }
}

exports.validateSchema = validateSchema;