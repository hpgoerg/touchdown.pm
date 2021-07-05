/**
 * @module restServer
 * @author Hans-Peter Görg
 **/

const https = require('https');

const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const cors = require('@koa/cors');
const combineRouters = require('koa-combine-routers')
const bodyParser = require('koa-body');

const {
    USE_PRETTY_PRINT, DEFAULT_LOG_LEVEL_KOA, REST_SERVER_PORT_FOR_PROD_HTTPS} = require('../../../config');
const koaLogger = require('koa-pino-logger')({
    level: DEFAULT_LOG_LEVEL_KOA,
    prettyPrint: USE_PRETTY_PRINT
});
const gracefulShutdown = require('http-graceful-shutdown');
const {dbDisconnect} = require('../db/dbConnector');
const {loginfo} = require('../../shared/util/logWrapper');
const {setupGetAllRouter} = require('./router/getAllRouter');
const {setupGetOneRouter} = require('./router/getOneRouter');
const {setupConfigRouter} = require('./router/getConfigRouter');
const {setupPostRouter} = require('./router/postRouter');
const {setupPostLoginRouter} = require('./router/postLoginRouter');
const {setupDeleteRouter} = require('./router/deleteRouter');
const {setupPutRouter} = require('./router/putRouter');
const {i18nInit} = require('../../i18n/i18nWrapper');

/**
 * this function represents the rest server that hosts the
 * rest server API.
 *
 * @param port {number} - the port the rest server shall use
 * @param dbClient - the client to execute database commands
 * @returns {Promise<Server>} - the rest server
 */
async function restServer(port, dbClient) {
    i18nInit();
    let server;
    let protocol;

    const app = new Koa();
    app.use(cors());
    app.use(koaLogger);

    async function bindCollections(app, dbClient) {
        app.member = dbClient.db().collection("member");
        app.impediment = dbClient.db().collection("impediment");
        app.epic = dbClient.db().collection("epic");
        app.release = dbClient.db().collection("release");
        app.sprint = dbClient.db().collection("sprint");
        app.userstory = dbClient.db().collection("userstory");
    }

    bindCollections(app, dbClient);

    app.use(bodyParser());

    const getAllRouter = await setupGetAllRouter(app, dbClient);
    const getOneRouter = await setupGetOneRouter(app, dbClient);
    const getConfigRouter = await setupConfigRouter(app);
    const postRouter = await setupPostRouter(app, dbClient);
    const postLoginRouter = await setupPostLoginRouter(app, dbClient);
    const deleteRouter = await setupDeleteRouter(app, dbClient);
    const putRouter = await setupPutRouter(app, dbClient);

    combineRouters(
        getAllRouter,
        getOneRouter,
        getConfigRouter,
        postRouter,
        postLoginRouter,
        deleteRouter,
        putRouter
    );

    function showServerData() {
        protocol = server.addContext ? 'https' : 'http';
        loginfo(__('%s %s restserver.running', port, protocol));
    }


    if(port === REST_SERVER_PORT_FOR_PROD_HTTPS) {

        const options = {
            key: fs.readFileSync(path.resolve(__dirname, "../../../../frontend/cert/certificate.key")),
            cert: fs.readFileSync(path.resolve(__dirname, "../../../../frontend/cert/certificate.crt")),
            //ca: read file of your certificateAuthority
            requestCert: false,
            rejectUnauthorized: false
        };

        server = https.createServer(options, app.callback()).listen(port, showServerData);
    } else {
        //use HTTP
        server = app.listen(port, showServerData);
    }

    gracefulShutdown(server,
        {
            signals: 'SIGINT SIGTERM',
            timeout: 50000,
            development: false,
            onShutdown: cleanup,
            finally: function () {
                loginfo(__('%s %s restserver.shutdown', port, protocol));
            }
        }
    );

    async function cleanup() {
        await dbDisconnect();
    }

    return server;
}

exports.restServer = restServer;
