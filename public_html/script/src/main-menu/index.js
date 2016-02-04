/*
    Manages the main menu, allowing users to start/continue games, manage
    settings, manage friends, view stats, and logout
*/
'use strict';
import $ from 'jquery';

import './new-game';
import './continue-game';
import './extras';
import './settings';
import './logout';

import {promisified as socket} from '../socket';
import generate from '../generator';
import {createGameList} from './continue-game';
import {onLogin} from '../login';

const ENTER_KEY = 13;
const $labels = $('#sec-main-menu p[data-for]');
const $links = $('#sec-main-menu p[data-action]');

$labels.click(function() {
    // Change the currently active fieldset
    $(`#sec-main-menu div.toggleable,#settings fieldset`).removeClass('active');
    $('#change-password').addClass('active');
    $('#settings-error').text('');
    $('#settings p').removeClass('selected');
    $('#settings p[data-tab="change-password"]').addClass('selected');
    $(`#${$(this).attr('data-for')}`).addClass('active');
});

// Show the menu
onLogin(() => {
    $('#sec-main-menu,#main-menu').addClass('active');
});

// Add keyboard events to settings page
$('#settings fieldset')
    .each(function() {
        $(this).children('input')
            .each(function(i) {
                // Move to the next box or submit on enter pressed
                const last = $(this).parent().children('input').length - 1;
                $(this).keydown(({which}) => {
                    if(which === ENTER_KEY) {
                        if(i === last) {
                            $(this).parent().children('button').click();
                        } else {
                            $(this).parent().children('input').eq(i + 1).focus();
                        }
                    }
                });
            });
    });
