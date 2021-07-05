/**
 * @module getAllRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleFindAll} = require('../restHandleFindAll');
const {isAllowed} = require('../restHandleIsAllowed');
const {CODE} = require('../../../shared/constants/code');

async function setupGetAllRouter(app, dbClient) {
    const router = new Router();

    router.get('/impediment', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'impediment');
        }
    }).get('/member', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'member');
        }
    }).get('/epic', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'epic');
        }
    }).get('/release', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'release');
        }
    }).get('/sprint', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'sprint');
        }
    }).get('/userstory', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindAll(ctx, dbClient, 'userstory');
        }
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupGetAllRouter = setupGetAllRouter;
