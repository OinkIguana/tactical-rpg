'use strict';
import {login, createNewUser, resetPassword, userExists} from './database';
import generate from '../generator';
import sendEmail from '../email';

export default (socket) => {
    socket.on('login:login', ({username, password}, res) => {
        generate(function*() {
            try {
                yield login(username, password);
                res(null);
            } catch(error) {
                res('Your username or password is incorrect');
            }
        });
    });

    socket.on('login:sign-up', ({username, password, email}, res) => {
        generate(function*() {
            try {
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
                const validation_key = yield resetPassword(username, email);
                yield sendEmail(email, 'forgot-password', {validation_key: validation_key});
                res(null);
            } catch(error) {
                res('Your account could not be found with this information');
            }
        });
    });

    socket.on('login:user-exists', ({username}, res) => {
        userExists(username).then((exists) => {
            res(null, exists);
        });
    });
};