/*
    Populates and keeps the friends list updated
*/
'use strict';

import $ from 'jquery';

import {promisified as socket} from './socket';
import generate from '../generator';
import {onLogin} from '../login';

// Populate the friend list
onLogin(() => {
    generate(function*() {
        yield socket.emit('friends:all-friends');
    });
});