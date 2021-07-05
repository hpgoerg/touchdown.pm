/**
 * @module deleteRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleDelete} = require('../restHandleDelete');
const {isAllowed} = require('../restHandleIsAllowed');
const {CODE} = require('../../../shared/constants/code');



async function setupDeleteRouter(app, dbClient) {
    const router = new Router();

    router.delete('/userstory/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'userstory');
        }
    }).delete('/member/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'member');
        }
    }).delete('/impediment/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'impediment');
        }
    }).delete('/sprint/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'sprint');
        }
    }).delete('/release/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'release');
        }
    }).delete('/epic/:id/:version', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if(ctx.body.code === CODE.OK) {
            await handleDelete(ctx, dbClient, 'epic');
        }
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupDeleteRouter = setupDeleteRouter;
