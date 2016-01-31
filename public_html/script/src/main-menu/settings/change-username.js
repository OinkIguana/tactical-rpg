/*
    Changes the player's password
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../../socket';
import generate from '../../generator';
import {VALID_USERNAME} from '../../const';

const $form = $('fieldset#change-username');

const validate = (username, confirm) => {
    return new Promise((resolve, reject) => {
        // Don't bother sending guaranteed invalid data to the server
        if(username !== confirm) {
            return reject('Your usernames do not match.');
        }
        if(!VALID_USERNAME.test(username)) {
            return reject('That is not a valid username.');
        }
        resolve();
    });
};

const submit = () => {
    $('#settings-error').text('');
    generate(function*() {
        try {
            const [username, confirm] = [
                $('#change-username-new').val(),
                $('#change-username-confirm').val()
            ];
            yield validate(username, confirm);
            yield socket.emit('main-menu:change-username', {username: username});
            $('#settings-saved').addClass('active');
            $('#change-username-new,#change-username-confirm').val('');
            $('#change-username').removeClass('active');
            localStorage.setItem('rpg-username', username);
        } catch(error) {
            $('#settings-error').text(error);
        }
    });
};

$form.children('button')
    .click(submit);