/**
 * @module config
 * @author Hans-Peter Görg
 **/

//supported: 'en', 'de'
exports.DEFAULT_LOCALE = 'en';

/**
 * @name PROD_DB_URL {string} - URL of the production database (to adopt to your environment)
 */
exports.PROD_DB_URL = 'mongodb://localhost:27017';
exports.DEFAULT_DATABASE_NAME = 'test';

//if changed, value in frontend must be changed too
exports.REST_SERVER_PORT_FOR_PROD_HTTP = 3001;

//if changed, value in frontend must be changed too
exports.REST_SERVER_PORT_FOR_PROD_HTTPS = 3443;


exports.DEFAULT_LOG_LEVEL = 'info';
exports.DEFAULT_LOG_LEVEL_KOA = 'warn';
exports.USE_PRETTY_PRINT = true;
exports.SHOW_LOGS_ON_TEST = false;

exports.JWT_SECRET = '@@__###73brz_&';
exports.JWT_EXPIRATION = '6h';
exports.SALT_ROUNDS = 1;


/*If changing PASSWORD_REGEX you must adopt the text value of i18n id h.password in the backend locale files   AND
  the i18n value of i18n id "general.error.password.required" in the backend locale files
 */
exports.PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})';

//used for fake data admin user dan.demo@scrummers.com
exports.PASSWORD_VALID_FOR_TEST = 'Touchdown.PM#20';

//never change - could result in warnings
exports.EVENT_MAX_LISTENERS_FOR_TEST = 27;