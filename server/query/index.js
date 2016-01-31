/*
    Handles various queries about the database from the client
*/
'use strict';

import {userExists, findUsername} from './database';
import generate from '../generator';
import {socketUser} from '../user';

export default (socket) => {
    socket.on('query:user-exists', (username, res) => {
        userExists(username).then((exists) => {
            res(null, exists);
        });
    });
    socket.on('query:find-username', (user_id, res) => {
        generate(function*() {
            try {
                res(null, yield findUsername(user_id));
            } catch(error) {
                res('User does not exist');
            }
        });
    });
};