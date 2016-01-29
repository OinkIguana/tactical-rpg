/*
    Deals with logging in existing users
*/
'use strict';
import $ from 'jquery';

import {promisified as socket} from '../socket';

import generate from '../generator';

import {VALID_PASSWORD, VALID_USERNAME} from '../const.js';
import {alignActiveP} from './common';

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

const submit = () => {
    $('#login-error').text('');
    generate(function*() {
        try {
            const [username, password] = [
                $('#username').val(),
                $('#password').val()
            ];
            yield validate(username, password);
            const token = {username: username, password: password};
            yield socket.emit('login:login', token);
            localStorage.setItem('rpg-login-token', JSON.stringify(token));
            $('#sec-login,#sec-login p,#login').removeClass('active');
            $('#sec-main-menu').addClass('active');
            alignActiveP();
        } catch(error) {
            localStorage.removeItem('rpg-login-token');
            $('#login-error').text(error);
        }
    });
};

// Attempt to log in in automatically if a login token exists already
generate(function*() {
    try {
        if(!localStorage.getItem('rpg-login-token')) { throw 'No token'; }
        $('#sec-login,#sec-login p,fieldset#login').removeClass('active');
        $('#sec-main-menu').addClass('active'); // Assume they are logged in
        yield socket.emit('login:login', JSON.parse(localStorage.getItem('rpg-login-token')));
    } catch(error) {
        localStorage.removeItem('rpg-login-token');
        // Kick out may be a little delayed but good enough for now
        $('#sec-login,#sec-login p[data-for!="login"],fieldset#login').addClass('active');
        $('#sec-main-menu').removeClass('active');
        alignActiveP();
    }
});

$form.children('button')
    .click(submit);