/*
    Provides abstraction between the requests and the database access
*/
'use strict';
import {v4 as uuid} from 'node-uuid';
import {hash as hash_} from 'js-scrypt';
import {promisify} from 'bluebird';

import connect from '../database';

const hash = (...args) => {
    return promisify(hash_)(...args)
        .then((res) => res.toString('hex'));
};

export const login = (username, password) => {
    return connect(function*({query}) {
        const [{user_id, salt, password: hashed}] = yield query(`SELECT user_id, salt, password FROM accounts WHERE username = '${username}'`);
        if(hashed === (yield hash(password, salt))) {
            yield query(`UPDATE accounts SET active_date = NOW() WHERE user_id = ${user_id}`);
        } else {
            throw new Error('Invalid password');
        }
    });
};

export const createNewUser = (username, password, email) => {
    return connect(function*({query}) {
        const salt = uuid();
        const hashed = yield hash(password, salt);
        yield query(`INSERT INTO accounts (username, password, salt, email) VALUES ('${username}', '${hashed}', '${salt}', '${email}')`);
    });
};

export const clearPassword = (username, email) => {
    return connect(function*({query}) {
        const [{user_id}] = yield query(`SELECT user_id FROM accounts WHERE username = '${username}' AND email = '${email}'`);
        const validation_key = uuid();
        yield query(`UPDATE accounts SET password = 'CANNOT LOG IN', validation_key = '${validation_key}' WHERE user_id = ${user_id}`);
        return validation_key;
    });
};

export const resetPassword = (username, password, validation_key) => {
    return connect(function*({query}) {
        if(!validation_key) { throw 'No validation key'; }
        const [{user_id}] = yield query(`SELECT user_id FROM accounts WHERE username = '${username}' AND validation_key = '${validation_key}'`);
        const salt = uuid();
        const hashed = yield hash(password, salt);
        yield query(`UPDATE accounts SET salt = '${salt}', password = '${hashed}', validation_key = NULL WHERE user_id = ${user_id}`);
    });
};
