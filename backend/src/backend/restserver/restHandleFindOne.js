/**
 * @module restHandleFindOne
 * @author Hans-Peter Görg
 **/

const {ObjectId} = require('mongodb');
const {matches} = require('validator');
const {handleError} = require('./restHandleError');
const {CODE} = require('../../shared/constants/code');
const {findOne} = require('../db/dbFindHelper');

/**
 * Handles a rest request to find one dependent_refs of a collection
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 * On successful retrieval of the dependent_refs the document is set in ctx.body.
 *
 * @param ctx {object} - koa.js context
 * @param dbClient {object} - the client to execute database commands
 * @param coll - the collection of the document to find
 * @returns {Promise<void>}
 */
async function handleFindOne(ctx, dbClient, coll) {
    try {
        let isValid = matches(ctx.params.id, '([a-f]|[A-F]|[0-9]){24}');

        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                code: CODE.INVALID_MONGODB_OBJECTID_FORMAT
            };
            return;
        }

        let result = await findOne(dbClient.db(), coll, ObjectId(ctx.params.id));
        switch(result.code) {
            case CODE.DB_ERROR_OCCURRED:
                ctx.status = 500;
                break;
            case CODE.OK:
                ctx.status = 200;
                break;
            default:
                ctx.status = 404;
        }
        ctx.body = result;
    } catch (error) {
        handleError(ctx, error, '[restHandleFind#handleFindOne]');
    }
}

exports.handleFindOne = handleFindOne;
