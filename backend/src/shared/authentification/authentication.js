/**
 * @module authentication (module)
 *
 * @description
 * tools to handle password and json web token
 *
 * @author Hans-Peter Görg
 **/

const { logerror } = require('../util/logWrapper');
const {sign, verify} = require('jsonwebtoken');
const {genSaltSync, hashSync, compare} = require('bcryptjs');
const jwtDecode = require('jwt-decode');
const {CODE} = require('../constants/code');
const {JWT_SECRET, JWT_EXPIRATION, SALT_ROUNDS} = require('../../../config');
const {isSet} = require('../util/generalUtils');


/**
 * get a bcrypted hash of a password
 *
 * @param {string} password - plain password
 * @returns {string} - bcrypted hash of password
 */
function getHashedPassword(password) {
    let salt = genSaltSync(SALT_ROUNDS);
    return hashSync(password, salt);
}

/**
 * checks if password matches a bcrypted hash
 *
 * @param {string }password - plain password
 * @param {string} hashedPassword - bcryped hash
 * @returns {Promise<boolean>} - _true_ passwords match, _false_ passwords don't match
 */
async function isPasswordCorrect(password, hashedPassword) {
    return await compare(password, hashedPassword);
}

/**
 * creates a signed json web token with embedded member data
 *
 * @param _id - the id of the embedded member
 * @param {number} version - the version of the embedded member
 * @param {string} name - the name of the embedded member
 * @param {string} firstname - the firstname of the embedded member
 * @param {string} email - the email of the embedded member
 * @param {string } role - the role of the embedded member {@link enum.js}
 * @param {number | string }expires - *optional* expiresIn setting for token.
 * If expires is given the value must conform to the rules defined in {@link https://www.npmjs.com/package/jsonwebtoken}.
 * If no value is give the config-value JWT_EXPIRATION see {@link config.js} is used as default.
 *
 * @returns {string} - the signed json web token with embedded member data
 */
function generateJWTMember({_id, version, name, firstname, email, role}, expires) {
    let expiresIn = isSet(expires) ? expires : JWT_EXPIRATION;

    return sign({
        data: {
            member: {
                _id: _id,
                version: version,
                name: name,
                firstname: firstname,
                email: email,
                role: role
            }
        }
    }, JWT_SECRET, {expiresIn: expiresIn});
}

/**
 * decode a json web token
 *
 * @param token {string} - the signed token
 * @returns {Object} - returns the decoded data of the token
 */
function decodeJWT(token) {
    return (jwtDecode(token)).data;
}

/**
 * verifies a token and gives back the data embedded in the token on success.
 *
 * @param token {string}- a signed json web token with embedded member data
 * @returns {{data: Object, verifyResult: string}} - always returns a value of enum
 * TOKEN_VERIFY_RESULT and in case of a successful verification the embedded data
 */
function verifyAndDecodeJWT(token) {
    let code;
    let data;

    try {
        let decoded = verify(token, JWT_SECRET);
        data = decoded.data;
        code = CODE.OK;
    } catch (error) {
        if ((isSet(error.name)) && (error.name === 'TokenExpiredError')) {
            code = CODE.TOKEN_EXPIRED;
        } else {
            logerror(`[authentication#verifyJWT]: error: ${error}`);
            code = CODE.TOKEN_ERROR;
        }
    }
    return {
        code: code,
        data: data //may be undefined
    };
}

/**
 * extracts json web token (as Bearer token) from header authorization
 *
 * @param req - a koa.js request
 * @returns {string} - the extracted (but not decoded) token
 */
function extractTokenFromHeader(req)  {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
}

exports.getHashedPassword = getHashedPassword;
exports.isPasswordCorrect = isPasswordCorrect;
exports.generateJWTMember = generateJWTMember;
exports.decodeJWT = decodeJWT;
exports.verifyAndDecodeJWT = verifyAndDecodeJWT;
exports.extractTokenFromHeader = extractTokenFromHeader;



