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

const $labels = $('#sec-main-menu p[data-for]');
const $links = $('#sec-main-menu p[data-action]');

$labels.click(function() {
    // Change the currently active fieldset
    $(`#sec-main-menu div,#settings fieldset`).removeClass('active');
    $(`#${$(this).attr('data-for')}`).addClass('active');
    $labels.toggleClass('active');
});

// Loads the current games in progress from the server
export const load = () => {
    generate(function*() {
        $('#sec-main-menu,#main-menu').addClass('active');
        const games = yield socket.emit('main-menu:games-in-progress');
        createGameList(games);
    });
};