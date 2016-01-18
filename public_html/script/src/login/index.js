/*
    Manages the login, signup, and forgot password page
*/
'use strict';
import $ from 'jquery';

import login from './login';
import signup from './signup';
import forgotPassword from './forgot-password';

const $p = $('p');
$p.click(function() {
    // Change the currently active fieldset
    $(`fieldset`).removeClass('active');
    $(`fieldset#${$(this).attr('data-for')}`).addClass('active');
    $p.toggleClass('active');
});