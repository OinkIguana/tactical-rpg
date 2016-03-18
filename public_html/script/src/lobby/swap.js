/*
    Handles side swapping requests
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';
import generate from '../generator';
import status from './status';

import showMessage from './message';

let swap;
const respondSwap = (res) => {
    $('#lobby-swap').addClass('active');
    $('#lobby-accept-swap,#lobby-reject-swap')
        .off('click')
        .removeClass('active');
    if(swap) {
        swap(null, res);
        swap = undefined;
    }
};

$('#lobby-swap')
    .click(() => {
        generate(function*() {
            try {
                $('#lobby-swap').removeClass('active');
                const accepted = yield socket.emit('lobby:swap-request');
                if(!accepted) { throw 'Swap rejected'; }
                if(status.players.count == 2) {
                    showMessage('Swap accepted');
                }
            } catch(e) {
                showMessage('Swap rejected');
            } finally {
                $('#lobby-swap').addClass('active');
            }
        });
    });

socket.on('lobby:swap-request', (res) => {
    swap = res;
    $('#lobby-swap,#lobby-accept-swap,#lobby-reject-swap')
        .toggleClass('active');
    $('#lobby-accept-swap')
        .one('click', () => respondSwap(true));
    $('#lobby-reject-swap')
        .one('click', () => respondSwap(false));
});