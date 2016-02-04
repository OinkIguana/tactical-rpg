/*
    Common functions used by the login pages
*/
'use strict';
import $ from 'jquery';

// Set the login page back to its default state
export const reset = () => {
    $('.toggleable').removeClass('active');
    $('#sec-login,#sec-login p[data-for!="login"],fieldset#login').addClass('active');
    $('#login-error').text('');
    $('input').val('');
    $('#friend-notifications p,#sec-friends footer div,#sec-friends footer aside ul li').remove();
};
