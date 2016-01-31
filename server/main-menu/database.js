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

export const changePassword = (username, old, password) => {
    return connect(function*({query}) {
        const [{user_id, salt, password: hashed}] = yield query(`SELECT user_id,salt,password FROM accounts WHERE username = '${username}'`);
        if(hashed === (yield hash(old, salt))) {
            const newSalt = uuid();
            const newHashed = yield hash(password, newSalt);
            yield query(`UPDATE accounts SET password = '${newHashed}', salt = '${newSalt}' WHERE user_id = ${user_id}`);
        } else {
            throw 'Your current password is incorrect';
        }
    });
};

export const changeUsername = (old, username) => {
    return connect(function*({query}) {
        yield query(`UPDATE accounts SET username = '${username}' WHERE username = '${old}'`);
    });
};

export const changeEmail = (username, email) => {
    return connect(function*({query}) {
        yield query(`UPDATE accounts SET email = '${email}' WHERE username = '${username}'`);
    });
};