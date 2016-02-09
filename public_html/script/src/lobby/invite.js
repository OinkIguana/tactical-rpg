/*
    Allows inviting friends or searching for strangers to join your lobby
*/
'use strict';
import $ from 'jquery';

import generate from '../generator';
import {promisified as socket} from '../socket';
import {setStatus, status} from './status';
import {VALID_USERNAME} from '../const';
import initialize from './init';

$('#invite-to-game')
    .click(() => {
        $('#lobby-request-form')
            .addClass('active');
    });
$('#lobby-request-form fieldset button')
    .click(() => {
        generate(function*() {
            try {
                const user = $('#lobby-request-username').val();
                if(!VALID_USERNAME.test(user)) { throw 'Invalid username'; }
                yield socket.emit('lobby:invite-request', user);
                $('#lobby-request-error')
                    .text('Invite sent successfully.');
            } catch(e) {
                $('#lobby-request-error')
                    .text('Could not invite this player.');
            }
        });
    });

socket.on('lobby:invite', (who) => {
    $('#friend-notifications')
        .append(
            $('<p></p>')
                .text(`${who} has invited you to a game`)
                .append(
                    $('<button></button>')
                        .text('Accept')
                        .click(function() {
                            generate(function*() {
                                $(this).parent().remove();
                                const lobby = yield socket.emit('lobby:respond-request', {nameA: who, response: true});
                                $('#sec-lobby').addClass('active');
                                $('#sec-main-menu,#sec-main-menu *').removeClass('active');
                                initialize(lobby);
                            });
                        }),
                    $('<button></button>')
                        .text('Reject')
                        .click(function() {
                            $(this).parent().remove();
                            socket.emit('lobby:respond-request', {nameA: who, response: false});
                        }))
            );
});

let searchForMatch, cancelSearch;
searchForMatch = () => {
    socket.emit('lobby:search-for-match');
    $('#auto-match')
        .text('Cancel search')
        .one('click', cancelSearch);
};
cancelSearch = () => {
    socket.emit('lobby:cancel-search');
    $('#auto-match')
        .text('Auto-match opponent')
        .one('click', searchForMatch);
};

socket.on('lobby:update', cancelSearch);

$('#auto-match').one('click', searchForMatch);