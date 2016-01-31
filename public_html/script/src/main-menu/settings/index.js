/*
    Allows the player to change their settings
*/
'use strict';

import $ from 'jquery';

import './change-password';
import './change-username';
import './change-email';

const $tabs = $('#settings p[data-tab]');
$tabs.click(function() {
    $tabs.removeClass('selected');
    $(this).addClass('selected');
    $('#settings fieldset,#settings p').removeClass('active');
    $(`#settings #${$(this).attr('data-tab')}`).addClass('active');
});

