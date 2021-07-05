/**
 * @module dbMemoryServer
 *
 * @description
 * helpers for mongodb in memory server
 *
 * @author Hans-Peter Görg
 **/

const { MongoMemoryServer } = require('mongodb-memory-server');


let mongod;

/**
 * Starts a mongodb in memory server.
 * the mongodb in memory server is used for automatic tests.
 * Configuration for the server is done via [jest-mongodb-config.js](jest-mongodb-config.js.html)
 *
 * @returns {Promise<MongoMemoryServer>} - the mongod equivalent.
 */
async function startMemoryServer() {
    mongod = new MongoMemoryServer();
    await mongod.start();
    return mongod;
}

/**
 * stops the mongodb in memory server
 *
 * @returns {Promise<void>}
 */
async function stopMemoryServer() {
    await mongod.stop();
}

exports.startMemoryServer=startMemoryServer;
exports.stopMemoryServer=stopMemoryServer;