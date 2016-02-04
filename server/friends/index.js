/*
    Handles all requests relating to friends
*/
'use strict';

import {myFriends, myRequests, unfriend, createFriendRequest, confirmFriendRequest} from './database';
import {userID, idUser, socketUser, userSocket} from '../user';
import generate from '../generator';

export default (socket) => {
    socket.on('friends:all-friends', (nil, res) => {
        generate(function*() {
            try {
                const id = userID(socketUser(socket));
                if(id === undefined) { throw 'Not logged in'; }
                const friends = yield myFriends(id);
                const onlineStatus = friends.map((username) => ({username: username, online: userSocket(username) !== undefined}));
                res(null, onlineStatus);
            } catch(e) {
                res(null, []);
            }
        });
    });

    socket.on('friends:pending-requests', (nil, res) => {
        generate(function*() {
            try {
                const id = userID(socketUser(socket));
                if(id === undefined) { throw 'Not logged in'; }
                const requests = yield myRequests(id);
                res(null, requests);
            } catch(e) {
                res(null, []);
            }
        });
    });

    socket.on('friends:send-request', (nameB, res) => {
        generate(function*() {
            try {
                const nameA = socketUser(socket);
                if(nameA === undefined) { throw 'Not logged in'; }
                const userA = userID(nameA);
                yield createFriendRequest(userA, nameB);
                const socketB = userSocket(nameB);
                if(socketB !== undefined) {
                    socketB.emit('friends:request-received', nameA);
                }
                res(null);
            } catch(e) {
                res('Could not send a friend request');
            }
        });
    });

    socket.on('friends:respond-request', ({nameA, response}, res) => {
        generate(function*() {
            try {
                const nameB = socketUser(socket);
                if(nameB === undefined) { throw 'Not logged in'; }
                const userB = userID(nameB);
                const socketA = userSocket(nameA);
                if(response) {
                    yield confirmFriendRequest(nameA, userB);
                    if(socketA !== undefined) {
                        socketA.emit('friends:request-confirmed', nameB);
                    }
                } else {
                    yield unfriend(nameA, nameB);
                }
                res(null, !!socketA);
            } catch(e) {
                res('Could not respond to friend request');
            }
        });
    });

    socket.on('friends:unfriend', (user, res) => {
        generate(function*() {
            try {
                const nameA = socketUser(socket);
                if(nameA === undefined) { throw 'Not logged in'; }
                yield unfriend(nameA, user);
                res(null);
            } catch(e) {
                res('Could not remove friend');
            }
        });
    });
};