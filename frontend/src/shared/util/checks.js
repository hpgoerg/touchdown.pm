/**
 * @module checks
 *
 * @description
 * defines check helpers
 *
 * @author Hans-Peter Görg
 **/

import {getPasswordRegex} from "../backendConfig/backendConfig";

/**
 * Checks if a password conforms to the password rules.
 *
 * @param password - the password to check
 * @returns {boolean} - _true_ password does conform, _false_ password does not conform
 */
const checkPassword = (password) => {
    if(password.trim() !== password) {
        return false;
    }

    let regex = getPasswordRegex();
    const passwordRegExp = new RegExp(regex);
    return(passwordRegExp.test(password));
}

/**
 * Checks email format
 *
 * Regex uses [RFC 5322 Official Standard] {@link https://emailregex.com/}
 *
 * @param email {string} - the email address to check
 * @returns {boolean} - _true_ email format OK, _false_ email format not valid
 */
const checkEmail = (email) => {
    let regex = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
    const emailRegExp = new RegExp(regex);
    return(emailRegExp.test(email));
}

export {checkPassword, checkEmail};
