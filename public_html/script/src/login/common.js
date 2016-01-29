/*
    Common functions used by the login pages
*/
'use strict';
import $ from 'jquery';

// Align <p> elements to be at the bottom of the fieldset
export const alignActiveP = () =>
    $('#sec-login p.active')
        .each(function(i) {
            $(this).css({
                top: i * $(this).outerHeight(true) + $('#sec-login fieldset.active').outerHeight(true)
            });
        });