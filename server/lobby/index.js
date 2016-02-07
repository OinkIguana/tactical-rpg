/*
    Handles all requests relating to starting a new game
*/
'use strict';

import {v4 as uuid} from 'node-uuid';
import {socketUser} from '../user';

const games = {};
export default (socket) => {
    socket.on('lobby:new-game', (side, res) => {
        const id = uuid();
        const me = socketUser(socket);
        games[id] = {
            players: [side ? undefined : me, side ? me : undefined],
            open: false,
            ready: false
        };
        res(id);
    });
};