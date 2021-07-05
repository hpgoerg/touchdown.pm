/**
 * @module dbFindHelper
 *
 * @description
 * helpers to find one document or all dependent_refs of a collection
 *
 * @author Hans-Peter Görg
 **/

const {CODE} = require('../../shared/constants/code');
const {NO_VALUE} = require('../../shared/constants/enums');
const {logerror} = require('../../shared/util/logWrapper');


/**
 * Search all documents of a collection
 *
 * @param db {object}- the database
 * @param coll {string} - the collection

 * @returns {Promise<{code: string, documents: symbol, count: *}>} - returns always a value of [CODE](module-code.html).
 * Depending on code the found documents are return and the count of all documents in the collection and a boolean
 */
async function findAll(db, coll) {
    try {
        let result = await db.collection(coll).find().toArray();
        if (result.length === 0) {
            return {
                code: CODE.NO_ENTRIES_FOUND,
                documents: NO_VALUE,
                count: 0
            }
        }

        if (coll === 'member') {
            //password is not allowed to give to caller
            for (let i = 0; i < result.length; i++) {
                delete result[i].password;
            }
        }
        return {
            code: CODE.OK,
            documents: result,
            count: result.length
        }
    } catch (error) {
        logerror(`[dbFindHelper#findAll]: ${error.toString()}`);
        return {
            code: CODE.DB_ERROR_OCCURRED,
            documents: NO_VALUE,
            count: NO_VALUE
        }
    }
}

/**
 * Find one document of a collection
 *
 * @param db {object}- the database
 * @param coll {string}- the collection of the document
 * @param id {ObjectId}- the id of the document
 * @returns {Promise<{code: string, documents: object}>} - returns always a value of [CODE](module-code.html).
 * When successful the found dependent_refs
 */
async function findOne(db, coll, id) {
    try {
        let result = await db.collection(coll).findOne({"_id": id});
        if (!result) {
            return {
                code: CODE.NO_ENTRY_FOUND,
                document: NO_VALUE
            };
        }
        if (coll === 'member') {
            //password is not allowed to give to caller
            delete result.password;
        }
        return {
            code: CODE.OK,
            document: result
        };
    } catch (error) {
        logerror(`[dbFindHelper#findOne]: ${error.toString()}`);
        return {
            code: CODE.DB_ERROR_OCCURRED,
            document: NO_VALUE
        }
    }
}

/**
 * Find member document by email
 *
 * Beware (!) - This function shall only be used by backend internal functions because it gives back the password
 * of a member. Password shall not be delivered by rest services
 *
 * @param db {object}- the database
 * @param email {string} - the email address of the member to find
 * @returns {Promise<{code: string, document: {code: string, documents: Object}}|{code: string, document: symbol}>} -
 * returns always a value of [CODE](module-code.html).
 * When successful the found document is return, too
 */
async function findMemberByEmail(db, email) {
    try {
        let result = await db.collection('member').findOne({email: email});
        if (!result) {
            return {
                code: CODE.NO_ENTRY_FOUND,
                document: NO_VALUE
            };
        }

        return {
            code: CODE.OK,
            document: result
        };
    } catch (error) {
        logerror(`[dbFindHelper#findMemberByEmail]: ${error.toString()}`);
        return {
            code: CODE.DB_ERROR_OCCURRED,
            document: NO_VALUE
        }
    }
}

exports.findOne = findOne;
exports.findAll = findAll
exports.findMemberByEmail = findMemberByEmail;
