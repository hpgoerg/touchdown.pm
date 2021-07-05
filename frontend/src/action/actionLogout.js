/**
 * @module actionLogout
 *
 * @description
 * logout a member
 *
 * @author Hans-Peter Görg
 **/

import {logoutFromAccount} from "../model/account";
import {purgeToken} from "../model/token";

/**
 * logout a member
 *
 * the JWT token is purged and the accout removed
 */
const logout = () => {
    purgeToken();
    logoutFromAccount();
}

export {logout};
