/*
    Deals with logging in existing users
*/
'use strict';
import $ from 'jquery';

import {promisified as socket} from '../socket';

import generate from '../generator';

const PASSWORD_MIN_LENGTH = 8;
const VALID_USERNAME = /[\S]{3,}/;

const $form = $('fieldset#login');
const validate = (username, password) => {
    // Don't bother sending guaranteed invalid data to the server
    if(!VALID_USERNAME.test(username) || password.length < PASSWORD_MIN_LENGTH) {
        throw 'Your username or password is incorrect';
    }
};

const submit = () => {
    generate(function*() {
        try {
            const [username, password] = [
                $('#username').val(),
                $('#password').val()
            ];
            validate(username, password);
            yield socket.emit('login:login', {username: username, password: password});
            $('#sec-login').removeClass('active');
            $('#sec-main-menu').addClass('active');
        } catch(error) {
            $('#login-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);