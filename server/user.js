/*
    Stores data related to each user
*/
'use strict';

const users = {};

export const addUser = (user, data) => {
    users[user] = data;
};

export const removeUser = (user) => {
    delete users[user];
};

export const socketUser = (socket) => {
    for(let user of Object.keys(users)) {
        if(users[user].socket.id === socket.id) {
            return user;
        }
    }
};

export const userSocket = (user) => {
    return users[user] ? users[user].socket : undefined;
};
export const userID = (user) => {
    return users[user] ? users[user].userID : undefined;
};
export const idUser = (userID) => {
    for(let user of Object.keys(users)) {
        if(users[user].userID === userID) {
            return user;
        }
    }
};

export default {socketUser, userSocket, addUser, removeUser};