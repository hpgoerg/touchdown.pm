/**
 * @module serviceDeleteRest
 *
 * @description
 * Service to call rest server with verb DELETE
 *
 * @author Hans-Peter Görg
 **/

import {CODE} from "../shared/constants/code";
import {getToken, isSetToken} from "../model/token";
import {REST_SERVER_PROTOCOL, REST_SERVER, REST_SERVER_PORT} from "../config";


/**
 * Does a rest POST call to delete a userstory, a member, an impediment, a sprint, a release or an epic
 *
 * @param coll {string}- the document of the document to delete
 * @param id {string}- the id of the document to delete
 * @param version {number} - the version of the document to delete
 * @returns {Promise<Code, object>} - always a value of [CODE](module-code.html).
 * In case the code is CODE.WRONG_VERSION the actualDocument is given back - otherwise actualDocument is NO_VALUE
 */
const restDelete = async (coll, id, version) => {
    try {
        let myHeaders = new Headers();
        if (isSetToken()) {
            myHeaders.append('Authorization', 'Bearer ' + getToken());
        }
        myHeaders.append('connection', 'keep-alive');
        myHeaders.append('Accept', 'application/json');
        myHeaders.append( 'Content-Type', 'application/json');


        let urlCombined = `${REST_SERVER_PROTOCOL}://${REST_SERVER}:${REST_SERVER_PORT}/${coll}/${id}/${version}`;
        let response = await fetch(urlCombined, {
            method: 'DELETE', headers: myHeaders
        });
        if(response.status !== 405) {
            return await response.json();
        } else {
            response.code = CODE.METHOD_NOT_ALLOWED;
            return response;
        }
    } catch
        (error) {
        console.error(`[serviceDeleteRest#restDelete]: ${error.toString()}`);
        return {
            code: CODE.NETWORK_ERROR
        };
    }
}

export {restDelete};
