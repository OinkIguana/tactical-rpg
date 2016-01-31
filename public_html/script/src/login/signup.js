/*
    Deals with creating new accounts
*/
'use strict';
import $ from 'jquery';


import {promisified as socket} from '../socket';

import generate from '../generator';

import {VALID_USERNAME, VALID_EMAIL, VALID_PASSWORD} from '../const';
import {reset} from './common';

const $form = $('fieldset#new-account');

const validate = (username, password, confirm, email, emailConfirm) => {
    return generate(function*() {
        // Don't bother sending guaranteed invalid data to the server
        if(!VALID_USERNAME.test(username)) {
            throw 'Please enter a valid username';
        }
        if(!VALID_PASSWORD.test(password)) {
            throw `Please enter a valid password`;
        }
        if(!VALID_EMAIL.test(email)) {
            throw 'Please enter a valid email';
        }
        if(email !== emailConfirm) {
            throw 'Your email addresses do not match';
        }
        if(password !== confirm) {
            throw 'Your passwords do not match';
        }
        const exists = yield socket.emit('query:user-exists', username);
        if(exists) {
            throw 'This user already exists';
        }
    });
};

const submit = () => {
    $('#login-error').text('');
    generate(function*() {
        try {
            const [username, password, confirm, email, emailConfirm] = [
                $('#new-username').val(),
                $('#new-password').val(),
                $('#new-confirm-password').val(),
                $('#new-email').val(),
                $('#new-confirm-email').val()
            ];
            yield validate(username, password, confirm, email, emailConfirm);
            yield socket.emit('login:sign-up', {username: username, password: password, email: email});
            // Change the currently active fieldset
            reset();
        } catch(error) {
            $('#login-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);