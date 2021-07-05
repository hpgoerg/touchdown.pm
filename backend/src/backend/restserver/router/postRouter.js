/**
 * @module postRouter
 * @author Hans-Peter Görg
 **/

const Router = require('koa-router');
const {handleCreate} = require('../restHandleCreate');
const {handleLogin} = require('../restHandleLogin');

const {isAllowed} = require('../restHandleIsAllowed');
const {CODE} = require('../../../shared/constants/code');


async function setupPostRouter(app, dbClient) {
    const router = new Router();

    router.post('/userstory', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'userstory');
        }
    }).post('/member', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'member');
        }
    }).post('/release', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'release');
        }
    }).post('/sprint', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'sprint');
        }
    }).post('/epic', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'epic');
        }
    }).post('/impediment', async (ctx) => {
        await isAllowed(ctx, dbClient);
        if (ctx.body.code === CODE.OK) {
            await handleCreate(ctx, dbClient, 'impediment');
        }
    }).post('/member/login', async (ctx) => {
        await handleLogin(ctx, dbClient);
    });

    app.use(router.routes()).use(router.allowedMethods());

    return router;
}

exports.setupPostRouter = setupPostRouter;
