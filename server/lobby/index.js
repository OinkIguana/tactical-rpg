/*
    Handles all requests relating to starting a new game
*/
'use strict';

import {v4 as uuid} from 'node-uuid';
import {socketUser, userSocket, userLobby} from '../user';

const lobby = {};

const updateStatus = (id) => {
    if(lobby[id].players[0]) {
        userSocket(lobby[id].players[0].name)
            .emit('lobby:update', lobby[id]);
    }
    if(lobby[id].players[1]) {
        userSocket(lobby[id].players[1].name)
            .emit('lobby:update', lobby[id]);
    }
};

const unready = (id) => {
    lobby[id].players[0] && (lobby[id].players[0].ready = false);
    lobby[id].players[1] && (lobby[id].players[1].ready = false);
    updateStatus(id);
};
const startGame = (id) => {
    userSocket(lobby[id].players[0].name)
        .emit('lobby:start-game', lobby[id]);
    userSocket(lobby[id].players[1].name)
        .emit('lobby:start-game', lobby[id]);
};

export default (socket) => {
    socket.on('lobby:new-game', (side, res) => {
        const id = uuid();
        const me = socketUser(socket);
        if(!me) { return res('Not signed in'); }
        userLobby(me, id);
        const obj = { name: me, ready: false };
        lobby[id] = {
            id: id,
            players: [side ? undefined : obj, side ? obj : undefined],
            open: false
        };
        res(null, id);
    });

    const leaveLobby = (nil, res) => {
        res && res();
        const me = socketUser(socket);
        if(!me) { return; }
        const id = userLobby(me);
        if(!id) { return; }
        if(!lobby[id]) { return; }
        if(lobby[id].players[0] && lobby[id].players[0].name === me) {
            lobby[id].players[0] = undefined;
            if(lobby[id].players[1] === undefined) {
                delete lobby[id];
            } else {
                unready(id);
            }
        } else if(lobby[id].players[1] && lobby[id].players[1].name === me) {
            lobby[id].players[1] = undefined;
            if(lobby[id].players[0] === undefined) {
                delete lobby[id];
            } else {
                unready(id);
            }
        }
        userLobby(me, null);
    };
    socket.on('lobby:leave-lobby', leaveLobby);
    socket.on('disconnect', leaveLobby);

    socket.on('lobby:invite-request', (who, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        if(who === me) { return res('Cannot invite yourself'); }
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        unready(id);
        if(lobby[id].players[0] !== undefined && lobby[id].players[1] !== undefined) {
            return res('Lobby is full');
        }
        const them = userSocket(who);
        if(them) {
            them.emit('lobby:invite', {who: me, id: id}, (error) => {
                if(error) {
                    res('Could not invite');
                } else {
                    res(null);
                }
            });
            them.once(`lobby:invite-respond-${id}-${who}`, (accept, res) => {
                if(accept) {
                    if(lobby[id].players[0] !== undefined && lobby[id].players[1] !== undefined) {
                        return res('Lobby is full');
                    } else if(userLobby(who)) {
                        return res('You are already in a lobby');
                    } else {
                        if(lobby[id].players[0] === undefined) {
                            lobby[id].players[0] = {
                                name: who,
                                ready: false
                            };
                        } else {
                            lobby[id].players[1] = {
                                name: who,
                                ready: false
                            };
                        }
                        userLobby(who, id);
                        unready(id);
                        res(null, lobby[id]);
                    }
                }
                res(null);
            });
        } else {
            res('Opponent is not online');
        }
    });

    socket.on('lobby:swap-request', (nil, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        if(lobby[id].players[0] === undefined || lobby[id].players[1] === undefined) {
            lobby[id].players = [lobby[id].players[1], lobby[id].players[0]];
            unready(id);
            res(null, true);
        } else {
            unready(id);
            const otherSocket = lobby[id].players[0].name === me
                                    ? userSocket(lobby[id].players[1].name)
                                    : userSocket(lobby[id].players[0].name);
            otherSocket.emit('lobby:swap-request', (error, ok) => {
                if(error || !ok) {
                    res(null, false);
                } else {
                    lobby[id].players = [lobby[id].players[1], lobby[id].players[0]];
                    unready(id);
                    res(null, true);
                }
            });
        }
    });

    socket.on('lobby:cancel-search', (nil, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        if(lobby[id].open) {
            lobby[id].open = false;
            unready(id);
        }
        res && res(); // Call respond symbolically. The client isn't waiting
    });

    socket.on('lobby:search-for-match', (nil, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        const mine = userLobby(me);
        if(!lobby[mine]) { return res('Not in a lobby'); }
        lobby[mine].open = false;
        for(let id of Object.keys(lobby)) {
            // Join the open room
            if(lobby[id].open) {
                lobby[id].open = false;
                if(lobby[id].players[0] === undefined) {
                    lobby[id].players[0] = {
                        name: me,
                        ready: false
                    };
                } else if(lobby[id].players[1] === undefined) {
                    lobby[id].players[1] = {
                        name: me,
                        ready: false
                    };
                } else { continue; }
                delete lobby[mine];
                userLobby(me, id);
                unready(id);
                return;
            }
        }
        // Or become the open room
        lobby[mine].open = true;
        res && res(); // Call respond symbolically. The client isn't waiting
    });

    socket.on('lobby:ready', (readiness, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        if(lobby[id].players[0].name === me) {
            lobby[id].players[0].ready = readiness;
            if(readiness && lobby[id].players[1] && lobby[id].players[1].ready) {
                startGame(id);
            } else {
                updateStatus(id);
            }
        } else {
            lobby[id].players[1].ready = readiness;
            if(readiness && lobby[id].players[0] && lobby[id].players[0].ready) {
                startGame(id);
            } else {
                updateStatus(id);
            }
        }
    });
};