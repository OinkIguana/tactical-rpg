/*
    Directs the player towards the game lobby
*/
'use strict';
import $ from 'jquery';
import {initialize as initializeLobby} from '../lobby';

$('#sec-main-menu p[data-action="new-game"]')
    .click(() => {
        $('#sec-lobby').addClass('active');
        $('#sec-main-menu,#sec-main-menu *').removeClass('active');
        initializeLobby();
    });