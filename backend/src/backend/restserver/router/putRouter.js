/**
 * @module putRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleUpdate} = require('../restHandleUpdate');
const {handleUpdateMemberPassword} = require('../restHandleUpdatePassword');
const {isAllowed} = require('../restHandleIsAllowed');
const {CODE} = require('../../../shared/constants/code');


async function setupPutRouter(app, dbClient) {
    const router = new Router();

    router.put('/sprint', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'sprint');
        }
    }).put('/userstory', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'userstory');
        }
    }).put('/epic', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'epic');
        }
    }).put('/release', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'release');
        }
    }).put('/impediment', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'impediment');
        }
    }).put('/member', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleUpdate(ctx, dbClient, 'member');
        }
    }).put('/member/password', async (ctx) => {
        await isAllowed(ctx, dbClient, true);
        if (ctx.body.code === CODE.OK) {
            await handleUpdateMemberPassword(ctx, dbClient);
        }
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupPutRouter = setupPutRouter;
