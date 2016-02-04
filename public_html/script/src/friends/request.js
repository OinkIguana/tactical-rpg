/*
    Sends and receives friend requests
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../socket';
import generate from '../generator';
import {VALID_USERNAME} from '../const';
import {onLogin} from '../login';
import {addFriendToList} from './list';

const form = $('#friend-request-form');

form.click(function() {
        $(this)
            .removeClass('active')
            .children('#friend-request-username')
                .val('')
                .parent()
            .children('#friend-request-error')
                .text('');
    })
    .children('fieldset')
        .click(() => {return false;})
        .children('button')
            .click(() => {
                generate(function*() {
                    try {
                        const user = $('#friend-request-username').val();
                        if(!VALID_USERNAME.test(user)) { throw 'Invalid username'; }
                        yield socket.emit('friends:send-request', user);
                        $('#friend-request-error')
                            .text('Friend request sent successfully.');
                    } catch(e) {
                        $('#friend-request-error')
                            .text('Could not add this user as a friend.');
                    }
                });
            });

$('#sec-friends main span.add')
    .click(() => {
        form.addClass('active');
    });

const addFriendRequestNotification = (who) => {
    $('#friend-notifications')
        .append(
            $('<p></p>')
                .text(`${who} would like to add you as a friend`)
                .append(
                    $('<button></button>')
                        .text('Accept')
                        .click(function() {
                            generate(function*() {
                                $(this).parent().remove();
                                const online = yield socket.emit('friends:respond-request', {nameA: who, response: true});
                                addFriendToList({username: who, online: online});
                            });
                        }),
                    $('<button></button>')
                        .text('Reject')
                        .click(function() {
                            socket.emit('friends:respond-request', {nameA: who, response: false});
                            $(this).parent().remove();
                        }))
            );
};

// Get any pending friend requests
onLogin((loggedIn) => {
    generate(function*() {
        yield loggedIn;
        const requests = yield socket.emit('friends:pending-requests');
        requests.forEach(addFriendRequestNotification);
    });
});
// Receive any new friend requests
socket.on('friends:request-received', addFriendRequestNotification);