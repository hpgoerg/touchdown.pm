/**
 * @module getConfigRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleConfigProduction, handleConfigTest} = require('../restHandleConfig');


async function setupConfigRouter(app) {
    const router = new Router();

    router.get('/config/production', async (ctx) => {
        await handleConfigProduction(ctx);
    }).get('/config/test', async (ctx) => {
        await handleConfigTest(ctx);
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupConfigRouter = setupConfigRouter;
