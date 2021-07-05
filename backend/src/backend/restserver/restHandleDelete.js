/**
 * @module restHandleDelete
 * @author Hans-Peter Görg
 **/
const {matches} = require('validator');
const {ObjectId} = require('mongodb');
const {CODE} = require('../../shared/constants/code');
const {handleError} = require('./restHandleError');
const {convertStringToMongodbInt} = require('../util/mongodbTools');
const {deleteDocument} = require('../db/dbDeleteHelper');

/**
 * Handles a rest request to delete a document
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 *
 * @param ctx {object} - koa.js context
 * @param dbClient {object} - the client to execute database commands
 * @param coll - the collection of the document to delete
 * @returns {Promise<void>}
 */
async function handleDelete(ctx, dbClient, coll) {
    try {
        let id = ctx.params.id;
        let version = ctx.params.version;

        let isValid = matches(id, '([a-f]|[A-F]|[0-9]){24}');
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                code: CODE.INVALID_MONGODB_OBJECTID_FORMAT
            }
            return;
        }

        const {couldBeConverted, convertedValue} = convertStringToMongodbInt(version);
        if (!couldBeConverted) {
            ctx.status = 400;
            ctx.body = {
                code: CODE.INVALID_MONGODB_VERSION_FORMAT
            }
            return;
        }
        version = convertedValue;

        const result = await deleteDocument(dbClient, dbClient.db(), ObjectId(id), version, coll);

        switch(result.code) {
            case CODE.DB_ERROR_OCCURRED:
                ctx.status = 500;
                break;
            case CODE.OK:
                ctx.status = 200;
                break;
            default:
                ctx.status = 400;
        }
        ctx.body = result;
    } catch (error) {
        handleError(ctx, error, '[restHandleDelete#handleDelete]');
    }
}

exports.handleDelete = handleDelete;