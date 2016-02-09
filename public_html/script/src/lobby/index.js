/*
    Handles the lobby, allowing users to join games and switch sides
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';
import generate from '../generator';
import status from './status';
import initialize from './init';

import './swap';
import './invite';
import './ready';

$('#sec-lobby p[data-action="main-menu"]')
    .click(() => {
        socket.emit('lobby:leave-lobby');
        $('#sec-lobby').removeClass('active');
        $('#sec-main-menu,#main-menu').addClass('active');
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

export default initialize;