/**
 * @module serviceGetRest
 *
 * @description
 * Service to call rest server with verb GET
 *
 * @author Hans-Peter Görg
 **/

import {CODE} from "../shared/constants/code";
import {getToken, isSetToken} from "../model/token";
import {REST_SERVER_PROTOCOL, REST_SERVER, REST_SERVER_PORT} from "../config";


/**
 * Calls rest service to get the backend production configuration data with relevance for the client
 *
 * @returns {Promise<code,string,string,string>} -
 * _code_: see [CODE](module-code.html)
 * In case code is CODE.OK delivers:
 * _passwordRegexForProduction_: the regex to check the format of the production password -
 * _verificationWfProduction_: an array of strings describing the i18n ids for the verification workflow (used
 * for userstories, epics and sprints.
 */
const restGetConfigProduction = async () => {
    return await restGet('config/production', 'restGetConfigProduction');
};

/**
 * Calls rest service to get all documents of a collection
 *
 * @param coll {string} - the collection of the documents
 * @returns {Promise<{code,object,count}>} - always a value of [CODE](module-code.html)
 * In case of CODE.OK delivers
 * _documents_: all found documents -
 * _count_: the count of all found documents
 */
const restGetAll = async (coll) => {
    return await restGet(`${coll}`, 'restGetAll');
};

/**
 * calls rest service to get one document
 *
 * @param coll {string} - the collection of the document
 * @param id {string} - the id of the document
 * @returns {Promise<{code: string, data: object}>} - always a value of [CODE](module-code.html).
 * In case of CODE.OK delivers
 * _document_: the found document.
 */
const restGetOne = async (coll, id) => {
    return await restGet(`${coll}/${id}`, 'restGetOne');
};


/**
 * generic function to do a rest GET call
 *
 * @param url {string} - the url for the rest call
 * @param method {string}- the method of the caller (used for logging on error)
 * @returns {Promise<{code: string, data: object}>} - always a value of [CODE](module-code.html) and
 * depending on CODE the rest return data
 */
const restGet = async (url, method) => {
    try {
        let myHeaders = new Headers();
        if (isSetToken()) {
            myHeaders.append('Authorization', 'Bearer ' + getToken());
        }
        myHeaders.append('connection', 'keep-alive');
        myHeaders.append('Accept', 'application/json');

        let urlCombined = `${REST_SERVER_PROTOCOL}://${REST_SERVER}:${REST_SERVER_PORT}/${url}`;
        let response = await fetch(urlCombined,
            {method: 'GET', headers: myHeaders});
        if(response.status !== 405) {
            return await response.json();
        } else {
            response.code = CODE.METHOD_NOT_ALLOWED;
            return response;
        }
    } catch (error) {
        console.error(`[serviceGetRest#${method}]: ${error.toString()}`);
        return {
            code: CODE.NETWORK_ERROR
        };
    }
}

export {restGetConfigProduction, restGetAll, restGetOne};
