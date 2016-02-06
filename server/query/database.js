/*
    Provides abstraction between the requests and the database access
*/
'use strict';

import connect from '../database';

export const userExists = (username) => {
    return connect(function*({exists}) {
        return yield exists(`SELECT 1 FROM accounts WHERE username = '${username}'`);
    });
};

export const findUsername = (user_id) => {
    return connect(function*({query}) {
        const [{username}] = yield query(`SELECT username FROM accounts WHERE user_id = ${user_id}`);
        return username;
    });
};