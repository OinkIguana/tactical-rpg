/*
    Deals with logging in existing users
*/
'use strict';
import $ from 'jquery';

import {promisified as socket} from '../socket';

import generate from '../generator';

import {VALID_PASSWORD, VALID_USERNAME} from '../const';
import {reset, alignActiveP} from './common';

const $form = $('fieldset#login');

const validate = (username, password) => {
    return new Promise((resolve, reject) => {
        // Don't bother sending guaranteed invalid data to the server
        if(!VALID_USERNAME.test(username) || !VALID_PASSWORD.test(password)) {
            return reject('Your username or password is incorrect');
        }
        resolve();
    });
};

const loginHooks = [];
export const onLogin = (fn) => loginHooks.push(fn);

const submit = () => {
    $('#login-error').text('');
    generate(function*() {
        try {
            const [username, password] = [
                $('#username').val(),
                $('#password').val()
            ];
            yield validate(username, password);
            yield socket.emit('login:login', {username: username, password: password});
            localStorage.setItem('rpg-username', username);
            localStorage.setItem('rpg-password', password);
            $('#sec-login,#sec-login *').removeClass('active');
            loginHooks.forEach((fn) => fn());
        } catch(error) {
            localStorage.removeItem('rpg-username');
            localStorage.removeItem('rpg-password');
            $('#login-error').text(error);
        }
    });
};

// Attempt to log in in automatically if a login token exists already
generate(function*() {
    try {
        if(!localStorage.getItem('rpg-username') || !localStorage.getItem('rpg-password')) { throw 'No token'; }
        // Assume they are logged in correctly
        $('#sec-login,#sec-login *').removeClass('active');
        window.setTimeout(() => loginHooks.forEach((fn) => fn()), 0);
        // But check to make sure
        yield socket.emit('login:login', {
            username: localStorage.getItem('rpg-username'),
            password: localStorage.getItem('rpg-password'),
        });
    } catch(error) {
        localStorage.removeItem('rpg-username');
        localStorage.removeItem('rpg-password');
        // Kick out may be a little delayed but good enough for now
        reset();
    }
});

$form.children('button')
    .click(submit);