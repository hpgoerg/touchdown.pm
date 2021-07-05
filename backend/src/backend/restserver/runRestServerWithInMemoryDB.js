/**
 * @module runRestServerWithInMemoryDB
 * @author Hans-Peter Görg
 **/
const {MongoMemoryServer} = require('mongodb-memory-server');
const {restServer} = require('./restServer');
const {dbConnect} = require('../db/dbConnector');
const {loginfo, logerror} = require('../../shared/util/logWrapper');
const {setupSchemata} = require('../db/dbSetupSchemata');
const {generateEpics, generateMembers, generateUserstories, generateReleases,
        generateImpediments, generateSprints} = require('../db/dbGenerateMassData');
const {
    REST_SERVER_PORT_DEMO_WITH_IN_MEMORY_DB,
    DB_IP_FOR_INTEGRATION_TESTS, DB_PORT_FOR_INTEGRATION_TESTS, DB_NAME_FOR_INTEGRATON_TESTS
}
    = require('../../../config');
const {askYesNo} = require('../../shared/util/ask');
const {i18nInit} = require('../../i18n/i18nWrapper');


/**
 * Starting rest server with in-memory-db
 *
 * Before starting the the restserver the following tasks are done:
 * The schema for the in memory database is generated.
 * The admin account is setup with the test password (see config.js PASSWORD_VALID_FOR_TEST).
 * Fake mass data is be generated into the in memory db if the users wants to.
 *
 * @returns {Promise<void>}
 */
async function run() {
    try {
        const mongod = new MongoMemoryServer({
            instance: {
                dbName: DB_NAME_FOR_INTEGRATON_TESTS,
                ip: DB_IP_FOR_INTEGRATION_TESTS,
                port: DB_PORT_FOR_INTEGRATION_TESTS
            },
            binary: {
                version: '4.0.3',
                skipMD5: true
            }
        });
        const uri = await mongod.getUri();
        i18nInit();

        dbClient = await dbConnect(uri);
        db = await dbClient.db();
        const databaseName = db.databaseName;
        await setupSchemata(dbClient, databaseName);


        let confirmed = await askYesNo(__('q.use.massdata.inmemorydb'), false);
        if(confirmed) {
            //generate mass data
            await generateMembers(db, 20);
            await generateUserstories(db, 2);
            await generateEpics(db, 10, 5);
            await generateReleases(db, 10, 5);
            await generateSprints(db, 5, 2);
            await generateImpediments(db,10);
            loginfo(__('%s db.setup.fake.data.done', '[runRestServerWithInMemoryDB#run]:'));
        }

        await restServer(REST_SERVER_PORT_DEMO_WITH_IN_MEMORY_DB, dbClient);
    } catch (error) {
        logerror(`[runRestServerWithInMemoryDB#run]: ${error.toString()}`);
    }
}

run();
