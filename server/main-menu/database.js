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

export const gamesInProgress = (userID) => {
    return connect(function*({query}) {
        const gameIDs = (yield query(`SELECT game_id FROM game_players WHERE request_confirmed = TRUE AND user_a = '${userID}' OR user_b = '${userID}'`))
                                .map(({game_id}) => game_id);
        return (yield query(`SELECT game_data FROM games WHERE finished = FALSE AND game_id = ANY ('{${gameIDs}}')`))
                        .map(({game_data}) => game_data);
    });
};

export const changePassword = (userID, old, password) => {
    return connect(function*({query}) {
        const [{salt, password: hashed}] = yield query(`SELECT user_id,salt,password FROM accounts WHERE user_id = '${userID}'`);
        if(hashed === (yield hash(old, salt))) {
            const newSalt = uuid();
            const newHashed = yield hash(password, newSalt);
            yield query(`UPDATE accounts SET password = '${newHashed}', salt = '${newSalt}' WHERE user_id = ${userID}`);
        } else {
            throw 'Your current password is incorrect';
        }
    });
};

export const changeUsername = (userID, username) => {
    return connect(function*({query}) {
        yield query(`UPDATE accounts SET username = '${username}' WHERE user_id = '${userID}'`);
    });
};

export const changeEmail = (userID, email) => {
    return connect(function*({query}) {
        yield query(`UPDATE accounts SET email = '${email}' WHERE user_id = '${userID}'`);
    });
};