/*
    Handles the lobby, allowing users to join games and switch sides
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';
import generate from '../generator';
import {status} from './common';

export const initialize = () => {
    generate(function*() {
        try {
            const me = localStorage.getItem('rpg-username');
            const side = Math.floor(Math.random() * 2);
            status.players = [side ? undefined : me, side ? me : undefined];
            status.id = yield socket.emit('lobby:new-game', side);
        } catch(e) {
            $('#lobby-error').text(e);
        }
    });
};

$('#lobby-swap')
    .click(() => {
        generate(function*() {
            try {
                status.ready = false;
                const swap = yield socket.emit('lobby:swap');
                if(!swap) { throw 'Swap rejected'; }
                status.players = [status.players[1], status.players[0]];
            } catch(e) {
                $('#lobby-error').text('Swap rejected');
            }
        });
    });

$('#lobby-ready')
    .click(() => {
        generate(function*() {
            try {
                status.ready = false;
                yield socket.emit('lobby:ready');
            } catch(e) { /* What could really go wrong with this one */ }
        });
    });

export default {initialize};