/**
 * @module dbUpdatePasswordhelper
 *
 * @description
 * for updating a member password
 *
 * @author Hans-Peter Görg
 **/
const {logerror} = require('../../shared/util/logWrapper');
const {isNotSet} = require('../../shared/util/generalUtils');
const {CODE} = require('../../shared/constants/code');
const {checkPassword} = require('../../shared/util/passwordCheck');
const {getHashedPassword} = require('../../shared/authentification/authentication');


/**
 * updating a member password if the member still exists in the db
 * and the password conforms to the password rules.
 *
 * In the database a hashed version of the password is persisted
 *
 * @param dbClient {object}- the client to execute database commands
 * @param db - the database
 * @param email - the email of the member (used to find the member)
 * @param password - the new password for the member
 * @returns {Promise<{CODE}>} - returns a value of enum CODE
 */
async function updateMemberPassword(dbClient, db, email, password) {
    let code;

    const session = dbClient.startSession();

    try {
        await session.withTransaction(async () => {
            let doc = await db.collection('member').findOne({email: email});

            if (isNotSet(doc)) {
                code = CODE.NO_ENTRY_FOUND;
                return;
            }

            if (!checkPassword(password)) {
                code = CODE.INVALID_PASSWORD;
                return;
            }

            await db.collection('member').updateOne({_id: doc._id},
                {$set: {version: ++doc.version, password: getHashedPassword(password)}})

            code = CODE.OK;
        });
    } catch (error) {
        logerror(`[dbUpdatePasswordHelper#updatePassword]: ${error.toString()}`);
        code = CODE.DB_ERROR_OCCURRED;
    } finally {
        await session.endSession();
    }

    return {
        code: code
    }
}

exports.updateMemberPassword = updateMemberPassword;

