/*
    Store data used between the lobby functions
*/
'use strict';

import $ from 'jquery';
import {promisified as socket} from '../socket';

let ready = false;
let players = [];
let id = '';

const updateView = () => {
    $(`#sec-lobby #lobby-left header h2`)
        .text(players[0] || 'No opponent');
    $(`#sec-lobby #lobby-right header h2`)
        .text(players[1] || 'No opponent');
    // Disable invite buttons
    if(players[0] && players[1]) {
        $('#invite-to-game,#auto-match')
            .removeClass('active');
        $('#ready')
            .addClass('active');
    } else {
        $('#invite-to-game,#auto-match')
            .addClass('active');
        $('#ready')
            .removeClass('active');
    }
    // READINESS
};

export const setStatus = (status) => {
    ready = status.ready;
    players = status.players;
    id = status.id;
    updateView();
};

export const status = {
    get id() { return id; },
    set id(v) { id = v; },

    get players() {
        return {
            get 0() { return players[0]; },
            set 0(v) {
                players[0] = v;
                updateView();
            },
            get 1() { return players[1]; },
            set 1(v) {
                players[1] = v;
                updateView();
            },

            get count() {
                return !!players[0] + !!players[1];
            }
        };
    },
    set players(v) {
        players = v;
        updateView();
    },

    get ready() { return ready; },
    set ready(v) {
        ready = v;
        updateView();
    }
};

socket.on('lobby:update', setStatus);

export default status;