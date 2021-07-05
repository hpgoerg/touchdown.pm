/**
 * @module restHandleIsAllowed
 * @author Hans-Peter Görg
 **/

const {ObjectId} = require('mongodb');
const {isNotSet} = require('../../shared/util/generalUtils');
const {CODE} = require('../../shared/constants/code');
const {extractTokenFromHeader, verifyAndDecodeJWT} = require('../../shared/authentification/authentication');
const {handleError} = require('./restHandleError');
const {findOne} = require('../db/dbFindHelper');

/**
 * Checks Authentication via json web token that is transmitted from client
 * via Authorization header.
 * For member this function checks permission, too.
 *
 * In ctx.body always a value of [CODE](module-code.html) is set.
 *
 * @param ctx {object}- koa.js context
 * @param dbClient {object}- the client to execute database commands
 * @param isPasswdUpd {boolean=} - _optional_ order to update password with default _false_
 * @returns {Promise<void>}
 */
async function isAllowed(ctx, dbClient,isPasswdUpd = false) {
    try {
        let token = extractTokenFromHeader(ctx.req);
        if (isNotSet(token)) {
            ctx.status = 401;
            ctx.body = {
                code: CODE.TOKEN_DELIVERY_ERROR
            }
            return;
        }

        let verifyResult = verifyAndDecodeJWT(token);
        if (verifyResult.code !== CODE.OK) {
            ctx.status = 401;
            ctx.body = {
                code: verifyResult.code
            }
            return;
        }

        if (isNotSet(verifyResult.data.member)) {
            ctx.status = 401;
            ctx.body = {
                code: CODE.TOKEN_ERROR
            }
            return;
        }

        //check member
        let memberFromToken = verifyResult.data.member;
        let resultMember = await findOne(dbClient.db(), 'member', ObjectId(memberFromToken._id));
        if (resultMember.code === CODE.DB_ERROR_OCCURRED) {
            ctx.status = 500;
            ctx.body = {
                code: CODE.DB_ERROR_OCCURRED
            }
            return;
        }

        if (resultMember.code === CODE.NO_ENTRY_FOUND) {
            ctx.status = 401;
            ctx.body = {
                code: CODE.FORCED_LOGOUT
            }
            return;
        }

        let memberInDB = resultMember.document;
        if (memberInDB.role !== memberFromToken.role) {
            // forced logout between role change since login can have impact on permissions
            ctx.status = 401;
            ctx.body = {
                code: CODE.FORCED_LOGOUT
            }
            return;
        }

        if (isPasswdUpd) {
            // member can always update his password
            ctx.status = 200;
            ctx.body = {
                code: CODE.OK,
            }
            return;
        }

        ctx.status = 200;
        ctx.body = {
            code: CODE.OK,
        }

    } catch (error) {
        handleError(ctx, error, '[restHandleIsAllowed#isAllowed]');
    }
}

exports.isAllowed = isAllowed;
