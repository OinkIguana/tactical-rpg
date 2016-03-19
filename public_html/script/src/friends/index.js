/*
    Handles friend interaction in all sections of the game
*/
'use strict';

import $ from 'jquery';

import './chat';
import './list';
import './request';

$('footer')
    .children('div,aside')
        .children('header')
            .click(function() {
                $(this).parent().toggleClass('open');
            })
            .children('.close')
                .click(function() {
                    $(this).parents('div[data-who]').remove();
                });