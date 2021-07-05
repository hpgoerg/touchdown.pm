/**
 * @module restHandleCreate
 * @author Hans-Peter Görg
 **/

const {transformForMongoDB} = require('../util/mongodbTools');
const {CODE} = require('../../shared/constants/code');
const {validateSchema} = require('../util/schemaValidator');
const {
    userstorySchema,
    memberSchema,
    impedimentSchema,
    releaseSchema,
    sprintSchema,
    epicSchema
} = require('../db/dbSchemata');
const {create} = require('../db/dbCreateHelper');
const {handleError} = require('./restHandleError');

let schemata = {
    member: memberSchema,
    impediment: impedimentSchema,
    userstory: userstorySchema,
    release: releaseSchema,
    sprint: sprintSchema,
    epic: epicSchema
};

/**
 * Handles a rest request to create a document
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 * On successful creation of the document the insertedId (=_id of insertedDocument)
 * and the insertedDocument are set in ctx.body.
 * If the document does not conform to the database schema of the collection, the
 * validation errorMessages are set in ctx.body.
 *
 * @param ctx {object} - koa.js context
 * @param dbClient {object} - the client to execute database commands
 * @param coll - the collection of the document to create
 * @returns {Promise<void>}
 */
async function handleCreate(ctx, dbClient, coll) {
    try {
        const {body: doc} = ctx.request;

        const {isValid, errorMessages} = validateSchema(doc, schemata[coll]);
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                code: CODE.INVALID_MONGODB_SCHEMA,
                errorMessages: errorMessages
            };
            return;
        }

        const dataWithObjectIds = transformForMongoDB(doc);

        const result = await create(dbClient.db(), dataWithObjectIds, coll);
        switch (result.code) {
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
        handleError(ctx, error, '[restHandleCreate#handleCreate]');
    }
}

exports.handleCreate = handleCreate;