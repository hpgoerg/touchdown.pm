/**
 * @module runRestServerHttp
 *
 * @description
 * Start restserver with protocol HTTP
 *
 * @author Hans-Peter Görg
 **/

const {restServer} = require('./restServer');
const {dbConnect} = require('../db/dbConnector');
const {logerror} = require('../../shared/util/logWrapper');
const {REST_SERVER_PORT_FOR_PROD_HTTP} = require('../../../config');

/**
 * Method to start the production version of the rest server with protocol HTTP
 *
 * @returns {Promise<void>}
 */
async function run() {
    try {
        let dbClient = await dbConnect();

        await restServer(REST_SERVER_PORT_FOR_PROD_HTTP, dbClient);
    } catch (error) {
        logerror(`[runRestServerHttp#run]: ${error.toString()}`);
    }
}

run();