/**
 * @module getOneRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleFindOne} = require('../restHandleFindOne');
const {isAllowed} = require('../restHandleIsAllowed');
const {CODE} = require('../../../shared/constants/code');


async function setupGetOneRouter(app, dbClient) {
    const router = new Router();

    router.get('/impediment/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'impediment');
        }
    }).get('/member/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'member');
        }
    }).get('/epic/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'epic');
        }
    }).get('/release/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'release');
        }
    }).get('/sprint/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'sprint');
        }
    }).get('/userstory/:id', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleFindOne(ctx, dbClient, 'userstory');
        }
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupGetOneRouter = setupGetOneRouter;
