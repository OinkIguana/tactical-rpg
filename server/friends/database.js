/*
    Provides abstraction between the requests and the database access
*/
'use strict';

import connect from '../database';

export const myFriends = (userID) => {
    return connect(function*({query}) {
        const pairs = yield query(`SELECT user_a,user_b FROM friends WHERE request_confirmed = TRUE AND (user_a = ${userID} OR user_b = ${userID})`);
        const others = pairs.map((pair) => pair.user_a === userID ? pair.user_b : pair.user_a);
        const users = yield query(`SELECT username FROM accounts WHERE user_id = ANY ('{${others}}')`);
        return users.map(({username}) => username);
    });
};

export const myRequests = (userID) => {
    return connect(function*({query}) {
        const pairs = yield query(`SELECT user_a,user_b FROM friends WHERE request_confirmed = FALSE AND user_b = ${userID}`);
        const others = pairs.map((pair) => pair.user_a === userID ? pair.user_b : pair.user_a);
        const users = yield query(`SELECT username FROM accounts WHERE user_id = ANY ('{${others}}')`);
        return users.map(({username}) => username);
    });
};


export const createFriendRequest = (userA, nameB) => {
    return connect(function*({query}) {
        const [{user_id: userB}] = yield query(`SELECT user_id FROM accounts WHERE username = '${nameB}'`);
        yield query(`INSERT INTO friends (user_a, user_b) VALUES (${userA}, ${userB})`);
    });
};

export const confirmFriendRequest = (nameA, userB) => {
    return connect(function*({query}) {
        const [{user_id: userA}] = yield query(`SELECT user_id FROM accounts WHERE username = '${nameA}'`);
        yield query(`UPDATE friends SET request_confirmed = TRUE WHERE user_a = ${userA} AND user_b = ${userB}`);
    });
};

export const unfriend = (nameA, nameB) => {
    return connect(function*({query, exists}) {
        const [{user_id: userA}] = yield query(`SELECT user_id FROM accounts WHERE username = '${nameA}'`);
        const [{user_id: userB}] = yield query(`SELECT user_id FROM accounts WHERE username = '${nameB}'`);
        // Friend pair can be in either order
        yield exists(
            `DELETE FROM friends WHERE  (user_a = ${userA} AND user_b = ${userB}) OR
                                        (user_a = ${userB} AND user_b = ${userA})`);
    });
};
