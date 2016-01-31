/*
    Sends the user an email with a link to reset their password if they forgot it
*/
'use strict';
import $ from 'jquery';

import {promisified as socket} from '../socket';

import generate from '../generator';

import {VALID_USERNAME, VALID_EMAIL} from '../const';
import {reset} from './common';

const $form = $('fieldset#forgot-password');

const validate = (username, email) => {
    return new Promise((resolve, reject) => {
        // Don't bother sending guaranteed invalid data to the server
        if(!VALID_USERNAME.test(username)) {
            return reject('Please enter a valid username');
        }
        if(!VALID_EMAIL.test(email)) {
            return reject('Please enter a valid email');
        }
        resolve();
    });
};

const submit = () => {
    $('#login-error').text('');
    generate(function*() {
        try {
            const [username, email] = [
                $('#forgot-username').val(),
                $('#forgot-email').val()
            ];
            yield validate(username, email);
            yield socket.emit('login:forgot-password', {username: username, email: email});
            // Change the currently active fieldset
            reset();
        } catch(error) {
            $('#login-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);