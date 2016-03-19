/*
    Handles chat messages and the chat boxes
*/
'use strict';
import $ from 'jquery';
import {promisified as socket} from '../socket';

const ENTER_KEY = 13;

const VALID_MESSAGE = /[\S]+/;

export const sendChatMessage = (input) => {
    if(VALID_MESSAGE.test($(input).val())) {
        const message = $('<p></p>')
            .addClass('chat me')
            .text($(input).val());
        socket.emit('friends:chat-message', {
            message: $(input).val(),
            username: $(input).parent().parent().attr('data-who')
        }).catch(() => {
            message.addClass('error');
        });
        $(input)
            .parent()
        .children('div')
            .append(message)
            .scrollTop($(input).parent().children('div').prop('scrollHeight'));
    }
};

export const addChatBox = (friend) => {
    if($('#sec-friends footer').children(`div[data-who="${friend.username}"]`).length === 0) {
        const input = $('<input></input>')
            .attr('type', 'text')
            .focus(function() {
                $(this)
                    .parent()
                .children('p')
                    .removeClass('new');
            })
            .keypress(function(event) {
                if(event.which === ENTER_KEY) {
                    sendChatMessage(this);
                    $(this).val('');
                    return false;
                }
            });
        $('#sec-friends footer')
            .prepend(
                $('<div></div>')
                    .addClass('open')
                    .attr('data-who', friend.username)
                    .append(
                        $('<header></header>')
                            .click(function() {
                                $(this).parent().toggleClass('open');
                            })
                            .append(
                                $('<span></span>')
                                    .addClass(`user ${friend.online ? 'on' : 'off'}line`)
                                    .attr('data-who', friend.username)
                                    .text(friend.username),
                                $('<span></span>')
                                    .addClass('icon close')
                                    .click(function() {
                                        $(this).parents('div[data-who]').remove();
                                    })),
                        $('<main></main>')
                            .click(function() {
                                $(this).children('input').focus();
                            })
                            .append(
                                $('<div></div>'),
                                input)));
        input.focus();
    }
};

socket.on('friends:chat-message', ({username, message}) => {
    let div = $(`#sec-friends footer div[data-who="${username}"]`);
    if(div.length === 0) {
        addChatBox({
            username: username,
            online: $(`[data-who="${username}"]`).hasClass('online')
        });
        div = $(`#sec-friends footer div[data-who="${username}"]`);
    }
    div.children('main')
            .children('div')
                .append(
                    $('<p></p>')
                        .addClass('new chat them')
                        .text(message)
                )
                .scrollTop(div.children('main').prop('scrollHeight'));
});

