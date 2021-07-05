/**
 * @module dbSetupSchemata
 *
 * @description
 * setups the schemata for the database.
 *
 * @author Hans-Peter Görg
 **/

const {
    userstorySchema,
    releaseSchema,
    impedimentSchema,
    memberSchema,
    sprintSchema,
    epicSchema
} = require('./dbSchemata');

async function setupSchemaUserstory(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("userstory", {
            validator: {
                $jsonSchema: userstorySchema
            }
        }
    );
}

async function setupSchemaRelease(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("release", {
            validator: {
                $jsonSchema: releaseSchema
            }
        }
    );
}

async function setupSchemaImpediment(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("impediment", {
            validator: {
                $jsonSchema: impedimentSchema
            }
        }
    );
}

async function setupSchemaMember(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("member", {
            validator: {
                $jsonSchema: memberSchema
            }
        }
    );
}

async function setupSchemaSprint(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("sprint", {
            validator: {
                $jsonSchema: sprintSchema
            }
        }
    );
}

async function setupSchemaEpic(dbClient, databaseName) {
    return await dbClient.db(databaseName).createCollection("epic", {
            validator: {
                $jsonSchema: epicSchema
            }
        }
    );
}

/**
 * sets up the indices for the collections in the database
 *
 * @param dbClient {object} - the client to execute database commands
 * @returns {Promise<void>}
 */
async function createIndices(dbClient) {
    await dbClient.db().collection('member').createIndex( { email: 1 }, { unique: true  } );
    await dbClient.db().collection('impediment').createIndex( {name: 1}, {unique: true});
    await dbClient.db().collection('sprint').createIndex( {name: 1}, {unique: true});
    await dbClient.db().collection('epic').createIndex( {name: 1}, {unique: true});
    await dbClient.db().collection('userstory').createIndex( {name: 1}, {unique: true});
    await dbClient.db().collection('release').createIndex( {releasenr: 1}, {unique: true});
}

/**
 * sets up the database schema and creates indices
 *
 * @param dbClient {object} - the client to execute database commands
 * @param databaseName {string} - the name of the database
 * @returns {Promise<void>}
 */
async function setupSchemata(dbClient, databaseName) {
    await dbClient.db(databaseName).dropDatabase();
    await setupSchemaMember(dbClient, databaseName);
    await setupSchemaImpediment(dbClient, databaseName);
    await setupSchemaEpic(dbClient, databaseName);
    await setupSchemaRelease(dbClient, databaseName);
    await setupSchemaSprint(dbClient, databaseName);
    await setupSchemaUserstory(dbClient, databaseName);

    await createIndices(dbClient);
}

exports.schemaMember = setupSchemaMember;
exports.schemaImpediment = setupSchemaImpediment;
exports.schemaEpic = setupSchemaEpic;
exports.schemaRelease = setupSchemaRelease;
exports.schemaSprint = setupSchemaSprint;
exports.schemaUserstory = setupSchemaUserstory;
exports.setupSchemata = setupSchemata;
