/**
 * @module dbDeleteHelper
 *
 * @description
 * used to delete a document
 *
 * @author Hans-Peter Görg
 **/
const {cloneDeep} = require('lodash/lang');
const {CODE} = require('../../shared/constants/code');
const {logerror} = require('../../shared/util/logWrapper');
const {isNotSet} = require('../../shared/util/generalUtils');
const {deleteReferencesToMember, deleteReferencesToUserstory} = require(('../util/dbDocUtils'));
const {NO_VALUE} = require('../../shared/constants/enums');

/**
 * generic function to delete a document
 *
 * If a newer version of the document exists in database, the document is not deleted.
 *
 * @param dbClient - the client to execute database commands
 * @param db - the database
 * @param id - the id of the document to delete
 * @param version - the persistent count of the document (every update increments the version)
 * @param coll - the collection that holds the document
 * @returns {Promise<CODE> | Promise<CODE, object>} - returns an enum value enum _DELETE_RESULT_ and in case that a newer version exists
 * the actual document from database
 */
async function deleteDocument(dbClient, db, id, version, coll) {
    let code;
    let actualDoc = NO_VALUE;

    const session = dbClient.startSession();

    try {
        await session.withTransaction(async () => {
            let doc = await db.collection(coll).findOne({_id: id});

            if (isNotSet(doc)) {
                code = CODE.NO_ENTRY_FOUND;
                return;
            }
            if (doc.version !== version) {
                actualDoc = cloneDeep(doc);
                code = CODE.WRONG_VERSION;
                return;
            }

            if (coll === 'member') {
                await deleteReferencesToMember(db, id);
            } else if (coll === 'userstory') {
                await deleteReferencesToUserstory(db, id);
            }

            await db.collection(coll).deleteOne({_id: id});
            code = CODE.OK;
        });
    } catch (error) {
        logerror(`[dbDeleteHelper#deleteDocument]: ${error.toString()}`);
        code = CODE.DB_ERROR_OCCURRED;
    } finally {
        await session.endSession();
    }

    return {
        code: code,
        actualDocument: actualDoc
    }
}

exports.deleteDocument = deleteDocument;
