/**
 * @module restHandleFindAll
 * @author Hans-Peter Görg
 **/

const {handleError} = require('./restHandleError');
const {CODE} = require('../../shared/constants/code');
const {findAll} = require('../db/dbFindHelper');

/**
 * Handles a rest request to find all documents of a collection
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 *
 * In ctx.body, depending on the code value, the found documents abd the count of documents is delivered

 *
 * @param ctx {object} - koa.js context
 * @param dbClient {object} - the client to execute database commands
 * @param coll - the collection of the document to create
 * @returns {Promise<void>}
 */
async function handleFindAll(ctx, dbClient, coll) {
    try {
        let result = await findAll(dbClient.db(), coll);

        if(result.code === CODE.NO_ENTRIES_FOUND) {
            ctx.status = 404;
        } else if (result.code === CODE.OK) {
            ctx.status = 200;
        } else { //DB_ERROR_OCCURRED
            ctx.status = 404
        }

        ctx.body = result;
    } catch (error) {
        handleError(ctx, error, '[restHandleFindAll#handleFindAll]');
    }
}

exports.handleFindAll = handleFindAll;
