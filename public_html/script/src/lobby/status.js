/*
    Store data used between the lobby functions
*/
'use strict';

import $ from 'jquery';
import {promisified as socket} from '../socket';

let _players = [];
let _id = '';

const updateView = () => {
    $(`#sec-lobby #lobby-left header h2`)
        .text(_players[0] && _players[0].name || 'No opponent');
    $(`#sec-lobby #lobby-right header h2`)
        .text(_players[1] && _players[1].name || 'No opponent');
    // Disable invite buttons
    if(_players[0] && _players[1]) {
        $('#invite-to-game,#auto-match')
            .removeClass('active');
        $('#lobby-ready')
            .addClass('active');
    } else {
        $('#invite-to-game,#auto-match')
            .addClass('active');
        $('#lobby-ready')
            .removeClass('active');
    }
    // READINESS
    if(_players[0] && _players[0].ready) {
        $('#sec-lobby #lobby-left').addClass('ready');
    } else {
        $('#sec-lobby #lobby-left').removeClass('ready');
    }
    if(_players[1] && _players[1].ready) {
        $('#sec-lobby #lobby-right').addClass('ready');
    } else {
        $('#sec-lobby #lobby-right').removeClass('ready');
    }
};

export const setStatus = (status) => {
    _players = status.players;
    _id = status.id;
    updateView();
};

export const status = {
    get id() { return _id; },
    set id(v) { _id = v; },

    get players() {
        return {
            get 0() {
                return {
                    get name() { return _players[0] ? _players[0].name : undefined; },
                    set name(v) { if(_players[0]) { _players[0].name = v; updateView(); } },
                    get ready() { return _players[0] ? _players[0].ready : false; },
                    set ready(v) { if(_players[0]) { _players[0].ready = v; updateView(); } }
                };
            },
            set 0(v) {
                _players[0] = v;
                updateView();
            },
            get 1() {
                return {
                    get name() { return _players[1] ? _players[1].name : undefined; },
                    set name(v) { if(_players[1]) { _players[1].name = v; updateView(); } },
                    get ready() { return _players[1] ? _players[1].ready : false; },
                    set ready(v) { if(_players[1]) { _players[1].ready = v; updateView(); } }
                };
            },
            set 1(v) {
                _players[1] = v;
                updateView();
            },

            get count() {
                return !!_players[0] + !!_players[1];
            }
        };
    },
    set players(v) {
        _players = v;
        updateView();
    },

    get ready() {
        return _players[0].name == localStorage.getItem('rpg-username')
            ? _players[0].ready
            : _players[1].ready;
    },
    set ready(v) {
        if(_players[0].name == localStorage.getItem('rpg-username')) {
            _players[0].ready = v;
        } else {
            _players[1].ready = v;
        }
        updateView();
    }
};

socket.on('lobby:update', setStatus);

export default status;