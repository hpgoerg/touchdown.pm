/**
 * @module runDBSetup
 *
 * @description
 * used to setup the database (with its schemata and indices) and to setup the admin
 *
 * @author Hans-Peter Görg
 **/

require('colors');
const {setupSchemata} = require('./dbSetupSchemata');
const {dbConnect, dbDisconnect} = require('./dbConnector');
const {askYesNo} = require('../../shared/util/ask');
const { loginfo, logerror} = require('../../shared/util/logWrapper');
const { DEFAULT_DATABASE_NAME} = require('../../../config');
const {isSet} = require('../../shared/util/generalUtils');
const {i18nInit} = require('../../i18n/i18nWrapper');

/**
 * Setup of production DB with Schemata and indices
 *
 * @returns {Promise<void>}
 */
async function run() {
    let dbClient;

    try {
        i18nInit();
        console.log(__('q.setup.db').green.bold);
        let confirmed = await askYesNo(__('h.drop.db'), false);
        if(confirmed) {
            dbClient = await dbConnect();
            await setupSchemata(dbClient, DEFAULT_DATABASE_NAME);
            loginfo(__('%s db.setup.done', '[runDBSetup#run]:'));
        } else {
            loginfo(__('%s no.action', '[runDBSetup#run]:'));
        }
    } catch (error) {
        logerror(`[runDBSetup#run]: ${error.toString()}`);
    } finally {
        if(isSet(dbClient)) {
            await dbDisconnect();
        }
    }
}

run();
