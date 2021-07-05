/**
 * @module servicePostRest
 *
 * @description
 * Service to call rest server with verb POST
 *
 * @author Hans-Peter Görg
 **/

import {CODE} from "../shared/constants/code";
import {getToken, isSetToken} from "../model/token";
import {REST_SERVER_PROTOCOL, REST_SERVER, REST_SERVER_PORT} from "../config";


/**
 * calls rest call to login a member
 *
 * @param email {string} - the email address of the member
 * @param password {string} - the password (plain data) for the login
 * @returns {Promise<{Code, string}>} - always a value of [CODE](module-code.html).
 * In case of CODE.OK delivers the generated json web token (containing data of the logged in member)
 */
const restPostLoginMember = async (email, password) => {
    let payload = {email: email, password: password};
    return await restPost('member/login', payload, 'restPostLoginMember');
};

/**
 * call rest call to create a userstory, a member, a release, a sprint, an epic or an impediment
 *
 * @param coll {string} - the collection for the document to create
 * @param doc {object} - the document to create
 * @returns {Promise<{CODE, array}>} - always returns a vlaue of [CODE](module-code.html).
 * In case of CODE.INVALID_MONGODB_SCHEMA delivers in _errorMessages_: the error messages of the mongodb schema error
 */
const restPostCreate = async (coll, doc) => {
    return await restPost(coll, doc, 'restPostCreate');
};

/**
 * generic function to do a rest POST call for login
 *
 * @param url {string}- the url for the rest call
 * @param method {string}- the method of the caller (used for logging on error)
 * @param payload {object} - the payload for the rest call
 * @returns {Promise<{data: object}>} - data always has a value of [CODE](module-code.html) and the other return data,
 * depending on the rest call
 */
const restPost = async (url, payload, method) => {
    try {
        let data = JSON.stringify(payload);

        let myHeaders = new Headers();
        if (isSetToken()) {
            myHeaders.append('Authorization', 'Bearer ' + getToken());
        }
        myHeaders.append('connection', 'keep-alive');
        myHeaders.append('Accept', 'application/json');
        myHeaders.append( 'Content-Type', 'application/json');

        let urlCombined = `${REST_SERVER_PROTOCOL}://${REST_SERVER}:${REST_SERVER_PORT}/${url}`;
        let response = await fetch(urlCombined, {
            method: 'POST', headers: myHeaders, body: data
        });

        if(response.status !== 405) {
            return await response.json();
        } else {
            response.code = CODE.METHOD_NOT_ALLOWED;
            return response;
        }
    } catch
        (error) {
        console.error(`[servicePostRest#${method}]: ${error.toString()}`);
        return {
            code: CODE.NETWORK_ERROR
        };
    }
}

export {restPostLoginMember, restPostCreate};
