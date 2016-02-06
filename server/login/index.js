/*
    Handles all requests from the login page
*/
'use strict';

import {login, createNewUser, clearPassword, resetPassword} from './database';
import generate from '../generator';
import sendEmail from '../email';
import {addUser, userSocket} from '../user';
import {myFriends} from '../friends/database';

export default (socket) => {
    socket.on('login:login', ({username, password}, res) => {
        generate(function*() {
            try {
                const id = yield login(username, password);
                addUser(username, {
                    socket: socket,
                    userID: id
                });
                res(null);
                try {
                    const friends = yield myFriends(id);
                    friends.forEach((friend) => {
                        const friendSocket = userSocket(friend);
                        if(friendSocket !== undefined) {
                            friendSocket.emit('friends:state-change', {username: username, online: true});
                        }
                    });
                } catch(error) { /* Suppress this one */ }
            } catch(error) {
                res('Your username or password is incorrect');
            }
        });
    });

    socket.on('login:sign-up', ({username, password, email}, res) => {
        generate(function*() {
            try {
                if(username.length < 3 || password.length < 8) {
                    throw 'Invalid username/password';
                }
                yield createNewUser(username, password, email);
                res(null);
            } catch(error) {
                res('An error occurred while creating your account');
            }
        });
    });

    socket.on('login:forgot-password', ({username, email}, res) => {
        generate(function*() {
            try {
                const validation_key = yield clearPassword(username, email);
                yield sendEmail(email, 'forgot-password', {username: username, validation_key: validation_key});
                res(null);
            } catch(error) {
                res('Your account could not be found with this information');
            }
        });
    });

    socket.on('login:reset-password', ({username, password, validation_key}, res) => {
        generate(function*() {
            try {
                yield resetPassword(username, password, validation_key);
                res(null);
            } catch(error) {
                res('You aren\'t allowed to reset this user\'s password');
            }
        });
    });
};