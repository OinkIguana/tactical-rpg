/*
    Provide messages and errors for a limited time
*/
'use strict';

import $ from 'jquery';

const box = $('#lobby-error');
let timeout;

export default (msg) => {
    box.text(msg);
    if(timeout) { clearTimeout(timeout); }
    setTimeout(() => box.text(''), 10000);
};