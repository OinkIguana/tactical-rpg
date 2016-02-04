/*
    Populates and keeps the friends list updated
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from '../socket';
import generate from '../generator';
import {onLogin} from '../login';

export const addFriendToList = (friend) => {
    $('#friend-list')
        .append(
            $('<li></li>')
                .append(
                    $('<span></span>')
                        .addClass(`user ${friend.online ? 'online' : 'offline'}`)
                        .text(friend.username))
                .click(function() {
                    $('#sec-friends footer')
                        .prepend(
                            $('<div></div>')
                                .attr('data-who', friend.username)
                                .append(
                                    $('<header></header>')
                                        .click(function() {
                                            $(this).parent().toggleClass('open');
                                        })
                                        .append(
                                            $('<span></span>')
                                                .addClass($(this).children('span').attr('class'))
                                                .text(friend.username),
                                            $('<span></span>')
                                                .addClass('icon close')
                                                .click(function() {
                                                    $(this).parents('div[data-who]').remove();
                                                })),
                                    $('<main></main>')));
                }));
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