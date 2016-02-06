/*
    Populates and keeps the friends list updated
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../socket';
import generate from '../generator';
import {onLogin} from '../login';
import {addChatBox} from './chat';

export const addFriendToList = (friend) => {
    $('#friend-list')
        .append(
            $('<li></li>')
                .append(
                    $('<span></span>')
                        .addClass(`user ${friend.online ? 'on' : 'off'}line`)
                        .attr('data-who', friend.username)
                        .text(friend.username))
                .click(() => addChatBox(friend)));
};

// Populate the friend list
onLogin((loggedIn) => {
    generate(function*() {
        yield loggedIn;
        const friends = yield socket.emit('friends:all-friends');
        for(let friend of friends) {
            addFriendToList(friend);
        }
    });
});

socket.on('friends:request-confirmed', (who) => {
    // Assume online, since they just confirmed it now
    addFriendToList({username: who, online: true});
});

socket.on('friends:state-change', ({username, online}) => {
    $(`.user[data-who=${username}]`)
        .removeClass('online', 'offline')
        .addClass(online ? 'online' : 'offline');
});