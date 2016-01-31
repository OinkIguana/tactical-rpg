/*
    Handles all requests from the main menu
*/
'use strict';

import generate from '../generator';
import {socketUser, removeUser, addUser} from '../user';
import {changePassword, changeUsername, changeEmail} from './database';

export default (socket) => {
    socket.on('disconnect', () => {
        removeUser(socketUser(socket));
    });
    socket.on('main-menu:logout', (nil, res) => {
        removeUser(socketUser(socket));
        res();
    });
    socket.on('main-menu:change-password', ({old, password}, res) => {
        generate(function*() {
            try {
                const username = socketUser(socket);
                if(username === undefined) { throw 'Not logged in'; }
                yield changePassword(username, old, password);
                res(null);
            } catch(error) {
                res('Your current password is incorrect');
            }
        });
    });
    socket.on('main-menu:change-username', ({username}, res) => {
        generate(function*() {
            try {
                const old = socketUser(socket);
                if(old === undefined) { throw 'Not logged in'; }
                yield changeUsername(old, username);
                removeUser(old);
                addUser(username, socket);
                res(null);
            } catch(error) {
                res('Chosen username is unavailable');
            }
        });
    });
    socket.on('main-menu:change-email', ({email}, res) => {
        generate(function*() {
            try {
                const username = socketUser(socket);
                if(username === undefined) { throw 'Not logged in'; }
                yield changeEmail(username, email);
                res(null);
            } catch(error) {
                res('This email is already associated with another account');
            }
        });
    });
};