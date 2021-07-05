/**
 * @module authentication
 *
 * @description
 * tools to handle password and json web token
 *
 * @author Hans-Peter Görg
 **/

import jwtDecode from 'jwt-decode';

/**
 * decode a json web token
 *
 * The json web token transports the data of the logged in member.
 * The JWT is used to secure the rest calls.
 *
 * @param token {string} - the signed token
 * @returns {Object} - returns the decoded data of the token
 */
const decodeJWT = (token) => {
    return (jwtDecode(token)).data;
};

export {decodeJWT};




