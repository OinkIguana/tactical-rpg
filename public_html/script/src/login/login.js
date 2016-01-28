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
            localStorage.setItem('rpg-login-token', token);
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
        if(!localStorage.getItem('rpg-login-token')) { return; }
        yield socket.emit('login:login', localStorage.getItem('rpg-login-token'));
        $('#sec-login').removeClass('active');
        $('#sec-main-menu').addClass('active');
    } catch(error) {
        localStorage.removeItem('rpg-login-token');
    }
});

$form.children('button')
    .click(submit);