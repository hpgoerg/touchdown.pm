/**
 * @module generalUtils
 *
 * @description
 * general utils for objects
 *
 * @author Hans-Peter Görg
 **/

import {NO_VALUE} from '../constants/enums';
import {CODE} from "../constants/code";
import {trim, trimEnd} from "lodash";

/**
 * utility to check if an object is undefined or null
 *
 * @param object - the object to check
 * @returns {boolean} - true: object is undefined or null, false: object is _not_ undefined and _not_ null
 */
const isNotSet = (object) => {
    return (!isSet(object));
}

/**
 * utility to check if an object is _not_ undefined and is _not_ null
 *
 * @param object - the object to check
 * @returns {boolean} - true: object isSet, false: object is not set (is undefined or null)
 */
const isSet = (object) => {
    return ((typeof object !== 'undefined') && (object !== null) && (object !== NO_VALUE));
}


/**
 * answers if [CODE](module-code.html) is technical critical, in which an error dialog
 * has to be chown and a logout must be initiated
 *
 * @param code - the code to check
 * @returns {boolean} - _true_: code is critical (in a technical sense), _false_: code is not critical
 */
const isCriticalCode = (code) => {
    return (
        (code === CODE.TOKEN_ERROR) ||                      //indicator of client coding error
        (code === CODE.TOKEN_DELIVERY_ERROR) ||             //indicator of client coding error
        (code === CODE.ERROR_CLIENT) ||                     //example: uiDB produces an error
        (code === CODE.DB_ERROR_OCCURRED) ||                //database error on server
        (code === CODE.INVALID_MONGODB_OBJECTID_FORMAT) ||  //indicator of client coding error
        (code === CODE.INVALID_MONGODB_SCHEMA) ||           //indicator of client coding error
        (code === CODE.INVALID_MONGODB_VERSION_FORMAT) ||   //indicator of client coding error
        (code === CODE.METHOD_NOT_ALLOWED) ||               //indicator of client coding error (invalid rest call)
        (code === CODE.NETWORK_ERROR)                       //server cannot be reached or is down
    );
}

/**
 * answers if [CODE](module-code.html) is authorization error code in which an error dialog
 * has to be chown and a logout must be initiated.
 *
 * CODE.INVALID_PASSWORD is not checked here. This code is only relevant during login.
 *
 * @param code - the code to check
 * @returns {boolean} - _true_: code is authorization error, _false_: code is no authorization error
 */
const isAuthorizationErrorCode = (code) => {
    return(
        (code === CODE.FORCED_LOGOUT) ||
        (code === CODE.TOKEN_EXPIRED)                       //account must be forced log out, token to old
    );
}

/**
 * Removes leading and trailing Spaces and (optional) Points
 *
 * Hint:
 * when the user enters multiple trailing Spaces in an normal input field some browers (like Chrome) add a Point to signal that trailing
 * Spaces have been entered.
 *
 * @param value {string} - the given value
 * @param removeTrailingPoint {boolean} - shall trailing point be removed
 * @returns {string} - the given value without leading and trailing Spaces and  without Points if removeTrailingPoint is true
 */
const extendedTrim = (value, removeTrailingPoint) => {
    let newValue;

    newValue = trim(value, ' ');

    if (removeTrailingPoint) {
        newValue = trimEnd(newValue, '.');
    }

    return newValue;
}

/**
 * Checks if a string has content
 *
 * @param value {string} - the string to check
 * @returns {boolean} - _true_ value has content _false_ value has no content
 */
const hasContent = (value) => {
    return (value !== "");
}

export {isNotSet, isSet, isCriticalCode, isAuthorizationErrorCode, extendedTrim, hasContent};