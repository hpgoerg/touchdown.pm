/**
 * @module restHandleUpdate
 * @author Hans-Peter Görg
 **/

const {ObjectId} = require('mongodb');
const {transformForMongoDB} = require('../util/mongodbTools');
const {validateSchema} = require('../util/schemaValidator');
const {
    userstorySchema,
    memberSchema,
    impedimentSchema,
    releaseSchema,
    sprintSchema,
    taskSchema,
    epicSchema
} = require('../db/dbSchemata');
const {updateDocument} = require('../db/dbUpdateHelper');
const {handleError} = require('./restHandleError');
const {CODE} = require('../../shared/constants/code');
const {logerror} = require('../../shared/util/logWrapper');

let schemata = {
    member: memberSchema,
    impediment: impedimentSchema,
    userstory: userstorySchema,
    task: taskSchema,
    release: releaseSchema,
    sprint: sprintSchema,
    epic: epicSchema
};


/**
 * generic function to update a document via Rest PUT
 *
 * ctx.request contains the document to update.
 * Via ctx.status and ctx.body the response is transported to the caller.
 * In ctx.body always a value of [CODE](module-code.html) is set.
 *
 * @param ctx - koa.js context (the id has to be given in the PUT-url even though technically not necessary to
 * conform to usual convention for Rest PUT
 * @param dbClient - the client to execute database commands
 * @param coll - the collection of document to update
 * @returns {Promise<void>}
 */
async function handleUpdate(ctx, dbClient, coll) {
    try {
        const {body: doc} = ctx.request;

        const {isValid, errorMessages} = validateSchema(doc, schemata[coll]);
        if (!isValid) {
            logerror(`restHandleUpdate#handleUpdate errorMessages: ${errorMessages.toString()}`);
            ctx.status = 422;
            ctx.body = {
                code: CODE.INVALID_MONGODB_SCHEMA
            };
            return;
        }

        const documentToUpdate = transformForMongoDB(doc);
        documentToUpdate._id = ObjectId(documentToUpdate._id);
        const result = await updateDocument(dbClient, dbClient.db(), documentToUpdate, coll);

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
        handleError(ctx, error, '[restHandleUpdate#handleUpdate]');
    }
}

exports.handleUpdate = handleUpdate;
