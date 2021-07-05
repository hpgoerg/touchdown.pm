/**
 * @module dbUpdateHelper
 * @description
 * helper to update a document
 *
 * @author Hans-Peter Görg
 **/
const {cloneDeep} = require('lodash/lang');
const { logerror } = require('../../shared/util/logWrapper');
const {isNotSet, isSet} = require('../../shared/util/generalUtils');
const {CODE } = require('../../shared/constants/code');
const {NO_VALUE} = require('../../shared/constants/enums');
const {MongoError} = require('mongodb');

/**
 * generic function to update a document
 *
 * @param dbClient {object}- the client to execute database commands
 * @param db {object}- the database
 * @param doc {object}- the document with the fields to persist as update
 * @param coll {string}- the collection that holds the document to  update
 * @returns {Promise<CODE> | Promise<CODE, object>} - returns an value of enum CODE and with the
 * exceptions of CODE.NO_ENTRY_FOUND, CODE.DUPLICATE_KEY and CODE.DB_ERROR_OCCURRED the actual document
 */
async function updateDocument(dbClient, db, doc, coll) {
    let code;
    let actualDoc = NO_VALUE;

    const session = dbClient.startSession();

    try {
        await session.withTransaction(async () => {
            let documentInDB = await db.collection(coll).findOne({_id: doc._id});

            if (isNotSet(documentInDB)) {
                code = CODE.NO_ENTRY_FOUND;
                return;
            }
            if (doc.version !== documentInDB.version) {
                code = CODE.WRONG_VERSION;
                actualDoc = cloneDeep(documentInDB);
                return;
            }

            let replaceDocument = cloneDeep(doc);
            replaceDocument.version++;

            if(coll === "member") {
                replaceDocument.password = documentInDB.password;
            }

            await db.collection(coll).replaceOne({'_id': doc._id},
                replaceDocument);
            actualDoc = replaceDocument;

            code = CODE.OK;
            actualDoc = replaceDocument;
        });
    } catch (error) {
        if ((error instanceof MongoError) && (isSet(error.code) && (error.code === 11000))) {
            code = CODE.DUPLICATE_KEY;
        } else {
            logerror(`[dbUpdateHelper#updateDocument]: ${error.toString()}`);
            code = CODE.DB_ERROR_OCCURRED;
        }
    } finally {
        await session.endSession();
    }

    if (isSet(actualDoc)) {
        if (coll === 'member') {
            if (isSet(actualDoc.password)) {
                //password is not allowed to give to caller
                delete actualDoc.password;
            }
        }
    }
    return {
        code: code,
        actualDocument: actualDoc
    };
}

exports.updateDocument = updateDocument;

