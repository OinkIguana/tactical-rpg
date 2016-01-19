'use strict';
import {validLogin} from './database';
import generate from '../generator';

export default (socket) => {
    socket.on('login:login', ({username, password}, res) => {
        generate(function*() {
            res((yield validLogin(username, password)) ? null : 'Your username or password is incorrect');
        });
    });

    socket.on('login:sign-up', ({username, password, email}, res) => {
        res(null);
    });

    socket.on('login:forgot-password', ({username, email}, res) => {
        res(null);
    });
};