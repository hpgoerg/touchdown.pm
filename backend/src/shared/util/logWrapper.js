/**
 * @module logWrapper
 *
 * @description
 * wraps the pino logger to suppress log output on test if not wanted
 *
 * @author Hans-Peter Görg
 **/

const {DEFAULT_LOG_LEVEL, USE_PRETTY_PRINT, SHOW_LOGS_ON_TEST} = require('../../../config');

const log = require('pino')({
    level: DEFAULT_LOG_LEVEL,
    prettyPrint: USE_PRETTY_PRINT
});
const {isNotSet} = require('./generalUtils');


function warn(message) {
    if( (isNotSet(global.jasmine) || (SHOW_LOGS_ON_TEST))) {
        log.warn(message);
    }
}

function info(message) {
    if( (isNotSet(global.jasmine) || (SHOW_LOGS_ON_TEST))) {
        log.info(message);
    }
}

function error(message) {
    if( (isNotSet(global.jasmine) || (SHOW_LOGS_ON_TEST))) {
        log.error(message);
    }
}

exports.logwarn = warn;
exports.loginfo = info;
exports.logerror = error;