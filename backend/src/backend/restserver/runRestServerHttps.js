/**
 * @module runRestServerHttps
 *
 * @description
 * Start restserver with protocol HTTPS
 *
 * @author Hans-Peter Görg
 **/

const {restServer} = require('./restServer');
const {dbConnect} = require('../db/dbConnector');
const {logerror} = require('../../shared/util/logWrapper');
const {REST_SERVER_PORT_FOR_PROD_HTTPS} = require('../../../config');

/**
 * Method to start the production version of the rest server with protocol HTTPS
 *
 * @returns {Promise<void>}
 */
async function run() {
    try {
        let dbClient = await dbConnect();

        await restServer(REST_SERVER_PORT_FOR_PROD_HTTPS, dbClient);
    } catch (error) {
        logerror(`[runRestServerHttps#run]: ${error.toString()}`);
    }
}

run();