/**
 * @module servicePutRest
 *
 * @description
 * Service to call rest server with verb PUT
 *
 * @author Hans-Peter Görg
 **/

import {CODE} from "../shared/constants/code";
import {getToken, isSetToken} from "../model/token";
import {REST_SERVER_PROTOCOL, REST_SERVER, REST_SERVER_PORT} from "../config";

/**
 * function to do a rest PUT call to update a member password
 *
 * @param email {string} - the email (identifier) of the member, who's password shall be updated
 * @param password {string} - the updated password
 * @returns {Promise<{CODE}>} - Contains a value of [CODE](module-code.html).
 */
const restPutUpdateMemberPassword = async (email, password) => {
    let payload = {email: email, password: password};
    return await restPut('member/password', payload);
};

/**
 * function to do a rest PUT call for update a sprint, a userstory, an epic, a release, an impediment or a member
 *
 * @param coll {string} - the collection of the document to update
 * @param updatedDoc {object} - the updated document
 * @returns {Promise<{CODE, object}>} - always delivers a value of [CODE](module-code.html).
 * Depending on the CODE further data is the _actualDocument_ (the updated document or in case of CODE.WRONG_VERSION
 * the newer version of the document from database).
 */
const restPutUpdate = async (coll, updatedDoc) => {
    return await restPut(coll, updatedDoc, 'restPutUpdate');
};

/**
 * generic function to do a rest PUT call
 *
 * @param url {string} - the url for the rest call
 * @param payload - the payload for the rest call
 * @param method {string}- the method of the caller (used for logging on error)
 * @returns {Promise<Response|{code: string}|any>} - always delivers a value of [CODE](module-code.html) and further
 * data depending on the value of CODE.
 */
const restPut = async (url,  payload, method) => {
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
            method: 'PUT', headers: myHeaders, body: data
        });
        if(response.status !== 405) {
            return await response.json();
        } else {
            response.code = CODE.METHOD_NOT_ALLOWED;
            return response;
        }
    } catch
        (error) {
        console.error(`[servicePostPut#${method}]: ${error.toString()}`);
        return {
            code: CODE.NETWORK_ERROR
        };
    }
}

export {restPutUpdate, restPutUpdateMemberPassword};
