/*
    Logs out the player, sending them back to the login page
*/
'use strict';
import $ from 'jquery';
import generate from '../generator';
import {promisified as socket} from '../socket';
import {reset as resetLogin} from '../login';

$('#sec-main-menu p[data-action="logout"]')
    .click(() => {
        generate(function*() {
            $('input').val('');
            resetLogin();
            localStorage.removeItem('rpg-username');
            localStorage.removeItem('rpg-password');
            yield socket.emit('main-menu:logout');
        });
    });