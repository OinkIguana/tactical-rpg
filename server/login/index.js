'use strict';
export default (socket) => {
    socket.on('login:login', ({username, password}, res) => {
        res(null);
    });

    socket.on('login:sign-up', ({username, password, email}, res) => {
        res(null);
    });

    socket.on('login:forgot-password', ({username, email}, res) => {
        res(null);
    });
};