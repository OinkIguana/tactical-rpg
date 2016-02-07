/*
    Store data used between the lobby functions
*/
'use strict';

import $ from 'jquery';

let ready = false;
let players = [];
let id = '';

const updateView = () => {
    $(`#sec-lobby #lobby-left header h2`)
        .text(players[0]);
    $(`#sec-lobby #lobby-right header h2`)
        .text(players[1]);
    // READINESS
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