'use strict';
import {v4 as uuid} from 'node-uuid';
import {hash as hash_} from 'js-scrypt';

import {promisify} from 'bluebird';
const hash = promisify(hash_);

import connect from '../database';

export const validLogin = (username, password) => {
    return connect(function*(query) {
        try {
            const {user_id, salt, password: hashed} = yield query(`SELECT user_id, salt, password FROM accounts WHERE username = '${username}'`);
            return hashed === (yield hash(password, salt)).toString('hex');
        } catch(e) {
            return false;
        }
    });
};

