/*
    Signal readiness so the game can begin
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';
import generate from '../generator';
import status from './status';

$('#lobby-ready')
    .click(() => {
        generate(function*() {
            try {
                status.ready = !status.ready;
                yield socket.emit('lobby:ready', status.ready);
            } catch(e) { /* What could really go wrong with this one */ }
        });
    });

socket.on('lobby:start-game', () => {
    $('#sec-lobby').removeClass('active');
    // This is probably going to be sec-story once story works
    $('#sec-game').addClass('active');
});