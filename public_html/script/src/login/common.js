'use strict';
import $ from 'jquery';

export const alignActiveP = () =>
    $('#sec-login p.active')
        .each(function(i) {
            $(this).css({
                top: i * $(this).outerHeight(true) + $('#sec-login fieldset.active').outerHeight(true)
            });
        });