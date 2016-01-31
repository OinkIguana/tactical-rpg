/*
    Changes the player's password
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../../socket';
import generate from '../../generator';
import {VALID_PASSWORD} from '../../const';

const $form = $('fieldset#change-password');

const validate = (old, password, confirm) => {
    return new Promise((resolve, reject) => {
        // Don't bother sending guaranteed invalid data to the server
        if(password !== confirm) {
            return reject('Your passwords do not match.');
        }
        if(!VALID_PASSWORD.test(password)) {
            return reject('That is not a valid password.');
        }
        if(!VALID_PASSWORD.test(old)) {
            return reject('Your current password is incorrect');
        }
        resolve();
    });
};

const submit = () => {
    $('#settings-error').text('');
    generate(function*() {
        try {
            const [old, password, confirm] = [
                $('#change-password-old').val(),
                $('#change-password-new').val(),
                $('#change-password-confirm').val()
            ];
            yield validate(old, password, confirm);
            yield socket.emit('main-menu:change-password', {old: old, password: password});
            $('#settings-saved').addClass('active');
            $('#change-password-old,#change-password-new,#change-password-confirm').val('');
            $('#change-password').removeClass('active');
            localStorage.setItem('rpg-password', password);
        } catch(error) {
            $('#settings-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);