/*
    Handles all requests from the main menu
*/
'use strict';

import generate from '../generator';
import {socketUser, removeUser, addUser, userID, userSocket} from '../user';
import {gamesInProgress, changePassword, changeUsername, changeEmail} from './database';
import {myFriends} from '../friends/database';

export default (socket) => {
    const logout = (nil, res) => {
        const username = socketUser(socket);
        const id = userID(username);
        removeUser(username);
        typeof res === 'function' && res();
        generate(function*() {
            const friends = yield myFriends(id);
            friends.forEach((friend) => {
                const friendSocket = userSocket(friend);
                if(friendSocket !== undefined) {
                    friendSocket.emit('friends:state-change', {username: username, online: false});
                }
            });
        });
    };

    socket.on('disconnect', logout);
    socket.on('main-menu:logout', logout);

    socket.on('main-menu:games-in-progress', (nil, res) => {
        generate(function*() {
            try {
                const id = userID(socketUser(socket));
                if(id === undefined) { throw 'Not logged in'; }
                const games = yield gamesInProgress(id);
                res(null, games);
            } catch(error) {
                res(null, []);
            }
        });
    });
    socket.on('main-menu:change-password', ({old, password}, res) => {
        generate(function*() {
            try {
                const id = userID(socketUser(socket));
                if(id === undefined) { throw 'Not logged in'; }
                yield changePassword(id, old, password);
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
                const id = userID(old);
                yield changeUsername(id, username);
                removeUser(old);
                addUser(username, {
                    socket: socket,
                    userID: id
                });
                res(null);
            } catch(error) {
                res('Chosen username is unavailable');
            }
        });
    });
    socket.on('main-menu:change-email', ({email}, res) => {
        generate(function*() {
            try {
                const id = userID(socketUser(socket));
                if(id === undefined) { throw 'Not logged in'; }
                yield changeEmail(id, email);
                res(null);
            } catch(error) {
                res('This email is already associated with another account');
            }
        });
    });
};