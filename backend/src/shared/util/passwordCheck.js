/**
 * @module passwordCheck
 *
 * @description
 * checking password to the defined rules from
 * [config.js](config.js.html)
 *
 * @author Hans-Peter Görg
 **/

const {PASSWORD_REGEX} = require('../../../config');

/**
 * Checks if a password conforms to the PASSWORD_REGEX defined in
 * [config.js](config.js.html)
 *
 * @param password - the password to check
 * @returns {boolean} - _true_ password does conform, _false_ password does not conform
 */
function checkPassword(password) {
    const passwordRegExp = new RegExp(PASSWORD_REGEX);
    return(passwordRegExp.test(password));
}

exports.checkPassword = checkPassword;