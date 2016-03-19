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
        $('#lobby-swap').addClass('active');
        $('#lobby-accept-swap,#lobby-reject-swap')
            .off('click')
            .removeClass('active');
    });

export default initialize;