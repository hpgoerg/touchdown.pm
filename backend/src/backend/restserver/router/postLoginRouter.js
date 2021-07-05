/**
 * @module postLoginRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleLogin} = require('../restHandleLogin');

async function setupPostLoginRouter(app, dbClient) {
    const router = new Router();

    router.post('/member/login', async (ctx) => {
        await handleLogin(ctx, dbClient);
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupPostLoginRouter = setupPostLoginRouter;
