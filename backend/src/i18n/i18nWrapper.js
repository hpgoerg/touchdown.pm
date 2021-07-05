/**
 * @module i18nWrapper
 * @author Hans-Peter Görg
 **/

const i18n = require('i18n');
const {DEFAULT_LOCALE} = require('../../config');

/**
 * configuration of i18n
 */
function i18nInit() {
    i18n.configure({
        locales: ['en', 'de'],
        directory: `${__dirname}/locales`,
        register: global
    });

    i18n.setLocale(DEFAULT_LOCALE);
}

exports.i18nInit = i18nInit;