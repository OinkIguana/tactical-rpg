'use strict';
import {v4 as uuid} from 'node-uuid';
import {hash as hash_} from 'js-scrypt';
import {promisify} from 'bluebird';

const hash = promisify(hash_);

import connect from '../database';

export const login = (username, password) => {
    return connect(function*({query}) {
        const [{user_id, salt, password: hashed}] = yield query(`SELECT user_id, salt, password FROM accounts WHERE username = '${username}'`);
        if(hashed === (yield hash(password, salt)).toString('hex')) {
            yield query(`UPDATE accounts SET active_date = NOW() WHERE user_id = ${user_id}`);
        } else {
            throw new Error('User does not exist');
        }
    });
};

export const createNewUser = (username, password, email) => {
    return connect(function*({query, exists}) {
        const salt = uuid();
        const hashed = yield hash(password, salt);
        yield query(`INSERT INTO accounts (username, password, salt, email) VALUES ('${username}', '${password}', '${salt}', '${email}')`);
    });
};

export const resetPassword = (username, email) => {
    return connect(function*({query, exists}) {
        const [{user_id, salt}] = yield query(`SELECT user_id, salt FROM accounts WHERE username = '${username}' AND email = '${email}'`);
        const password = uuid();
        const validation_key = uuid();
        const hashed = yield hash(password, salt);
        //yield query(`UPDATE accounts SET password = '${hashed}', validation_key = '${validation_key}' WHERE user_id = ${user_id}`);
        return validation_key;
    });
};

export const userExists = (username) => {
    return connect(function*({exists}) {
        return yield exists(`SELECT 1 FROM accounts WHERE username = '${username}'`);
    });
};