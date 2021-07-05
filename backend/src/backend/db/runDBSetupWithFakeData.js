/**
 * @module runDBSetupWithFakeData
 *
 * @description
 * used to setup the database with its schemata and indices
 * and with mass fake data
 *
 * @author Hans-Peter Görg
 **/
require('colors');
const {setupSchemata} = require('./dbSetupSchemata');
const {dbConnect, dbDisconnect} = require('./dbConnector');
const {askYesNo} = require('../../shared/util/ask');
const {loginfo, logerror} = require('../../shared/util/logWrapper');
const {DEFAULT_DATABASE_NAME} = require('../../../config');
const {isSet} = require('../../shared/util/generalUtils');
const {i18nInit} = require('../../i18n/i18nWrapper');
const {generateEpics, generateMembers, generateUserstories,
    generateReleases, generateImpediments, generateSprints} = require('./dbGenerateMassData');


/**
 * Setup of production DB with Schemata and indices and fake mass data.
 * The admin is setup with the test password (see config.js PASSWORD_VALID_FOR_TEST)
 *
 * @returns {Promise<void>}
 */
async function run() {
    let dbClient;
    try {
        i18nInit();
        console.log(__('q.setup.db.w.schemata').green.bold);
        let confirmed = await askYesNo(__('h.drop.db'), false);

        if (confirmed) {
            dbClient = await dbConnect();
            let db = await dbClient.db(DEFAULT_DATABASE_NAME);
            await setupSchemata(dbClient, DEFAULT_DATABASE_NAME);
            await generateMembers(db, 20);
            await generateUserstories(db, 2);
            await generateEpics(db, 10, 5);
            await generateReleases(db, 10, 5);
            await generateSprints(db, 5, 2);
            await generateImpediments(db,10);
            loginfo(__('%s db.setup.fake.data.done', '[runDBSetupWithFakeData#run]:'));

        } else {
            loginfo(__('%s no.action', '[runDBSetupWithFakeData#run]:'));
        }
    } catch (error) {
        logerror(`[runDBSetupWithFakeData#run]: ${error.toString()}`);
    } finally {
        if (isSet(dbClient)) {
            await dbDisconnect();
        }
    }
}

run();
