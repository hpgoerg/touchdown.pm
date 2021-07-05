/**
 * @module restHandleError
 * @author Hans-Peter Görg
 **/

const {isSet} = require('../../shared/util/generalUtils');
const { logerror } = require('../../shared/util/logWrapper');
const {CODE} = require('../../shared/constants/code');

/**
 * set ctx.status and ctx.body to propagate back the information
 * of a rest server error.
 * The ctx.status is always 500 and in ctx.body CODE.SERVER_ERROR,
 * see [CODE](module-code.html) is set.
 *
 * @param ctx {object} - koa.js context
 * @param error {object} - the rest server error object
 * @param method {string} - the originating method the rest server error
 */
function handleError(ctx, error, method) {
    if(isSet(error)) {
        logerror(`${method}: ${error.toString()} `);
    }
    ctx.status = 500;
    ctx.body = {
        code: CODE.SERVER_ERROR
    };
}

exports.handleError = handleError;