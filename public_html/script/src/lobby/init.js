'use strict';

import $ from 'jquery';

import generate from '../generator';
import {setStatus, status} from './status';
import {promisified as socket} from '../socket';

export default (lobby) => {
    generate(function*() {
        try {
            if(lobby === undefined) {
                const me = localStorage.getItem('rpg-username');
                const side = Math.floor(Math.random() * 2);
                status.players = [side ? undefined : me, side ? me : undefined];
                $('#lobby-swap').addClass('active');
                $('#lobby-accept-swap,#lobby-reject-swap').removeClass('active');
                $('#auto-match').text('Auto-match opponent');
                status.id = yield socket.emit('lobby:new-game', side);
            } else {
                setStatus(lobby);
            }
        } catch(e) {
            $('#lobby-error').text(e);
        }
    });
};