/*
    Handles side swapping requests
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';
import generate from '../generator';
import status from './status';

$('#lobby-swap')
    .click(() => {
        generate(function*() {
            try {
                $('#lobby-swap').removeClass('active');
                const swap = yield socket.emit('lobby:swap-request');
                if(!swap) { throw 'Swap rejected'; }
            } catch(e) {
                $('#lobby-error').text('Swap rejected');
            } finally {
                $('#lobby-swap').addClass('active');
            }
        });
    });

socket.on('lobby:swap-request', (res) => {
    $('#lobby-swap,#lobby-accept-swap,#lobby-reject-swap')
        .toggleClass('active');
    $('#lobby-accept-swap')
        .one('click', () => {
            $('#lobby-swap').addClass('active');
            $('#lobby-accept-swap,#lobby-reject-swap')
                .off('click')
                .removeClass('active');
            res(null, true);
        });
    $('#lobby-reject-swap')
        .one('click', () => {
            $('#lobby-swap').addClass('active');
            $('#lobby-accept-swap,#lobby-reject-swap')
                .off('click')
                .removeClass('active');
            res(null, false);
        });
});