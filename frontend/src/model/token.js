/**
 * @module token
 *
 * @description
 * store for the token of the logged in member.
 * The (bearer) token is needed for authorization of rest calls.
 *
 * @author Hans-Peter Görg
 **/
import {NO_VALUE} from "../shared/constants/enums";
import {isSet} from "../shared/util/generalUtils";

let token = NO_VALUE;

/**
 * In memory store of the token of the logged in member.
 * The (bearer) token is needed for authorizing rest calls.
 *
 * @param aToken - the token to store
 */
const setToken = (aToken) => {
    token = aToken;
};

/**
 * Gets the token of the logged in member
 *
 * @returns {string} - return the token
 */
const getToken = () => {
    return token;
};

/**
 * Answers if the token is set
 *
 * @returns {boolean} - _true_: token is set, _false_: token ist not set
 */
const isSetToken = () => {
    return isSet(token);
};


/**
 * Purges the token
 */
const purgeToken = () => {
    token = NO_VALUE;
}

export {setToken, getToken, isSetToken, purgeToken};
