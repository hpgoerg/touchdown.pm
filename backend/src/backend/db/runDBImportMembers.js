/**
 * @module runDBImportMembers
 *
 * @description
 * used to import new members into the db.
 * New members are imported from file newMembersImport.js
 *
 * @author Hans-Peter Görg
 **/

const {i18nInit} = require('../../i18n/i18nWrapper');
const {createMember} = require('../db/dbCreateHelper');
const {dbConnect, dbDisconnect} = require('./dbConnector');
const {loginfo, logerror} = require('../../shared/util/logWrapper');
const {isSet} = require('../../shared/util/generalUtils');
const {newMembers} = require('../../../newMembersImport');
const {checkPassword} = require('../../shared/util/passwordCheck');

async function isDBSetup(db) {
    return ((await db.collections()).length > 0);
}


/**
 * Imports new member into DB that are taken from file newMembersImport.js
 *
 * @returns {Promise<void>}
 */
async function run() {
    i18nInit();

    let dbClient;
    let db;
    let session;

    try {
        dbClient = await dbConnect();
        db = await dbClient.db();
        session = dbClient.startSession();

        const isSetupDone = await isDBSetup(dbClient.db());
        if (!isSetupDone) {
            loginfo(__('%s h.db.setup.first', '[runDBImportMembers#run]:'));
            return;
        }

        await session.withTransaction(async () => {
            for (let i = 0; i < newMembers.length; i++) {
                if (!checkPassword(newMembers[i].password)) {
                    throw new Error(__('h.password'));
                }

                await createMember(db, newMembers[i]);
            }
        });
        loginfo(__('%s import.members.done', '[runDBImportMembers#run]:'));
    } catch (error) {
        logerror(`[runDBImportMembers#run]: ${error.toString()}`);
        logerror(__('%s import.members.none', '[runDBImportMembers#run]:'));
    } finally {
        if (isSet(session)) {
            await session.endSession();
        }
        if (isSet(dbClient)) {
            await dbDisconnect();
        }
    }

}

run();
