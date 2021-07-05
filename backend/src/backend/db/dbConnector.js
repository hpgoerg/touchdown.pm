/**
 * @module dbConnector
 *
 * @description
 * used to get a mongodb client and to disconnect the mongodb client
 *
 * @author Hans-Peter Görg
 **/

const {PROD_DB_URL} = require('../../../config.js');


const MongoClient = require('mongodb').MongoClient;

let dbClient;

/**
 * disconnect to mongodb client
 *
 * @returns {Promise<void>}
 */
async function dbDisconnect() {
    await dbClient.close();
}

/**
 * get a mongodb client
 *
 * @param mongoUrl {string=} - *optional* URL for mongodb. If not give the default PROD_DB_URL from config.js is used
 * @returns {Promise<object>} - the created mongodb client
 */
async function dbConnect(mongoUrl) {
    let url = mongoUrl ? mongoUrl : PROD_DB_URL;

    dbClient = await MongoClient.connect(url, {  useNewUrlParser: true, useUnifiedTopology: true});
    return dbClient;
}

exports.dbConnect = dbConnect;
exports.dbDisconnect = dbDisconnect;