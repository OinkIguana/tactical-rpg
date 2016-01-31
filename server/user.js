/*
    Stores data related to each user
*/
'use strict';

const users = {};

export const addUser = (user, socket) => {
    users[user] = socket;
};

export const removeUser = (user) => {
    delete users[user];
};

export const socketUser = (socket) => {
    for(let user of Object.keys(users)) {
        if(users[user].id === socket.id) {
            return user;
        }
    }
};

export const userSocket = (user) => {
    return users[user];
};

export default {socketUser, userSocket, addUser, removeUser};