/*
    Initialize the lobby page whenever a game is joined
*/
'use strict';

import $ from 'jquery';

import generate from '../generator';
import {setStatus, status} from './status';
import {promisified as socket} from '../socket';

import showMessage from './message';

export default (lobby) => {
    generate(function*() {
        try {
            $('#lobby-swap').addClass('active');
            $('#lobby-accept-swap,#lobby-reject-swap').removeClass('active');
            $('#lobby-error').text('');
            $('#lobby-request-form').removeClass('active');
            $('#auto-match').text('Auto-match opponent');
            if(lobby === undefined) {
                const me = {
                    name: localStorage.getItem('rpg-username'),
                    ready: false
                };
                const side = Math.floor(Math.random() * 2);
                status.players = [side ? undefined : me, side ? me : undefined];
                status.id = yield socket.emit('lobby:new-game', side);
            } else {
                setStatus(lobby);
            }
        } catch(e) {
            showMessage(e);
        }
    });
};