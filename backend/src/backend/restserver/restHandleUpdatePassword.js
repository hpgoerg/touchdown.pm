/**
 * @module restHandlePasswordChange
 * @author Hans-Peter Görg
 **/

const {updateMemberPassword} = require('../db/dbUpdateMemberPasswordHelper');
const { CODE} = require('../../shared/constants/code');
const { handleError} = require('./restHandleError');


/**
 * Handles a rest request to update the password of a member.
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 *
 * @param ctx - koa.js context
 * @param dbClient - the client to execute database commands
 * @returns {Promise<Object>} - on login success a webtoken with member data
 */
async function handleUpdateMemberPassword(ctx, dbClient) {
    try {
        const {body: data} = ctx.request;
        const {email, password} = data;

        const result = await updateMemberPassword(dbClient, dbClient.db(), email, password);

        switch(result.code) {
            case CODE.DB_ERROR_OCCURRED:
                ctx.status = 500;
                break;
            case CODE.OK:
                ctx.status = 200;
                break;
            default:
                ctx.status = 400;
        }
        ctx.body = result;
    } catch (error) {
        handleError(ctx, error, '[restHandleUpdatePassword#handleUpdateMemberPassword]');
    }
}

exports.handleUpdateMemberPassword = handleUpdateMemberPassword;
