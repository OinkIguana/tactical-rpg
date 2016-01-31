/*
    Resets the password if the url has reset-password in the action slot
*/
'use strict';
import {parse as parseUrl} from 'url';
import $ from 'jquery';

import {promisified as socket} from '../socket';

import generate from '../generator';

import {VALID_PASSWORD} from '../const';

const $form = $('fieldset#reset-password');

const {pathname} = parseUrl(window.location.href);
const [, action, username, validation_key] = pathname.split('/');

if(action === 'reset-password') {
    $form.addClass('active');
    $('fieldset#login, #sec-login p').removeClass('active');
    const validate = (password, confirm) => {
        return new Promise((resolve, reject) => {
            // Don't bother sending guaranteed invalid data to the server
            if(password !== confirm) {
                reject('Your passwords do not match.');
            }
            if(!VALID_PASSWORD.test(password)) {
                reject('That is not a valid password.');
            }
            resolve();
        });
    };

    const submit = () => {
        $('#login-error').text('');
        generate(function*() {
            try {
                const [password, confirm] = [
                    $('#re-password').val(),
                    $('#re-confirm-password').val()
                ];

                yield validate(password, confirm);
                yield socket.emit('login:reset-password', {username: username, password: password, validation_key: validation_key});
                // Return to the normal page
                window.location.href = '/';
            } catch(error) {
                $('#login-error').text(error);
            }
        });
    };

    $form.children('button')
        .click(submit);
}