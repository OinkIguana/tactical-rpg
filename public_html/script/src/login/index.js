/*
    Manages the login, signup, and forgot password page
*/
'use strict';
import $ from 'jquery';

import './login';
import './signup';
import './forgot-password';
import './reset-password';

const $p = $('#sec-login p');
$p.click(function() {
    // Change the currently active fieldset
    $(`fieldset`).removeClass('active');
    $(`fieldset#${$(this).attr('data-for')}`).addClass('active');
    $p.toggleClass('active');
});