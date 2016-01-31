/*
    Changes the player's password
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../../socket';
import generate from '../../generator';
import {VALID_EMAIL} from '../../const';

const $form = $('fieldset#change-email');

const validate = (email, confirm) => {
    return new Promise((resolve, reject) => {
        // Don't bother sending guaranteed invalid data to the server
        if(email !== confirm) {
            return reject('Your emails do not match.');
        }
        if(!VALID_EMAIL.test(email)) {
            return reject('That is not a valid email.');
        }
        resolve();
    });
};

const submit = () => {
    $('#settings-error').text('');
    generate(function*() {
        try {
            const [email, confirm] = [
                $('#change-email-new').val(),
                $('#change-email-confirm').val()
            ];
            yield validate(email, confirm);
            yield socket.emit('main-menu:change-email', {email: email});
            $('#settings-saved').addClass('active');
            $('#change-email-new,#change-email-confirm').val('');
            $('#change-email').removeClass('active');
        } catch(error) {
            $('#settings-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);