/**
 * @module restHandleLogin
 * @author Hans-Peter Görg
 **/

const {isPasswordCorrect, generateJWTMember} = require('../../shared/authentification/authentication');
const {CODE} = require('../../shared/constants/code');
const {findMemberByEmail} = require('../db/dbFindHelper');
const {handleError} = require('./restHandleError');

/**
 * Handles a rest request for member login.
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 * On successful login a web token is created and set in ctx.body
 *
 * @param ctx - koa.js context
 * @param dbClient - the client to execute database commands
 * @returns {Promise<void>}
 */
async function handleLoginMember(ctx, dbClient) {
    try {
        const {body: data} = ctx.request;
        const {email, password} = data;

        let result = await findMemberByEmail(dbClient.db(), email);

        if (result.code === CODE.DB_ERROR_OCCURRED) {
            ctx.status = 500;
            ctx.body = {
                code: CODE.DB_ERROR_OCCURRED
            };
            return;
        }

        if (result.code === CODE.NO_ENTRY_FOUND) {
            ctx.status = 401;
            ctx.body = {
                code: CODE.NO_ENTRY_FOUND
            }
            return;
        }

        if (!(await isPasswordCorrect(password, result.document.password))) {
            ctx.status = 401;
            ctx.body = {
                code: CODE.INVALID_PASSWORD
            };
            return;
        }

        const jwt = generateJWTMember(result.document);
        ctx.status = 200;
        ctx.body = {
            code: CODE.OK,
            token: jwt
        };
    } catch (error) {
        handleError(ctx, error, '[restHandleLogin#handleLogin]');
    }
}

exports.handleLogin = handleLoginMember;
