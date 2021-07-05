/**
 * @module actionLogin
 *
 * @description
 * Actions to login a member
 *
 * @author Hans-Peter Görg
 **/

import {restPostLoginMember} from "../service/servicePostRest";
import {CODE} from "../shared/constants/code";
import {decodeJWT} from "../shared/permission/authentication";
import {setMember} from "../model/account";
import {setToken} from "../model/token";

/**
 * Action to handle the login of a member.
 *
 * On successful member login the account of the member is set and the member (bearer) token is stored.
 *
 * @param email {string} - the email address of the member
 * @param password {string} - the password (plain data) for the login
 * @returns {Promise<string>} - returns a value of [CODE](module-code.html)
 */
const loginMember = async (email, password) => {
    let result = await restPostLoginMember(email, password);
    const {code} = result;
    if(code === CODE.OK) {
        const {token} = result;
        let data = decodeJWT(token);
        setMember(data.member);
        setToken(token);
    }

    return code;
}

export {loginMember};
