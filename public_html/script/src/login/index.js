/*
    Manages the login, signup, and forgot password page
*/
'use strict';
import $ from 'jquery';

import './login';
import './signup';
import './forgot-password';
import './reset-password';

export * from './common';

const $labels = $('#sec-login p');
const ENTER_KEY = 13;

$labels.click(function() {
    // Change the currently active fieldset
    $(`#sec-login fieldset`).removeClass('active');
    $(`fieldset#${$(this).attr('data-for')}`).addClass('active');
    $labels.toggleClass('active');
});

// Add keyboard events to each element
$('#sec-login fieldset')
    .each(function() {
        $(this).children('input')
            .each(function(i) {
                // Move to the next box or submit on enter pressed
                const last = $(this).parent().children('input').length - 1;
                $(this).keydown(({which}) => {
                    if(which === ENTER_KEY) {
                        if(i == last) {
                            $(this).parent().children('button').click();
                        } else {
                            $(this).parent().children('input').eq(i + 1).focus();
                        }
                    }
                });
            });
    });
