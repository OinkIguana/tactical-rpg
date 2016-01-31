/*
    Common functions used by the login pages
*/
'use strict';
import $ from 'jquery';

// Align <p> elements to be at the bottom of the fieldset
export const alignActiveP = () => {
    $('#sec-login p.active')
        .each(function(i) {
            $(this).css({
                top: i * $(this).outerHeight(true) + $('#sec-login fieldset.active').outerHeight(true)
            });
        });
};

// Set the login page back to its default state
export const reset = () => {
    $('.toggleable').removeClass('active');
    $('#sec-login,#sec-login p[data-for!="login"],fieldset#login').addClass('active');
    $('#login-error').text('');
    $('input').val('');
    alignActiveP();
};
