/*
    Handles all requests relating to starting a new game
*/
'use strict';

import {v4 as uuid} from 'node-uuid';
import {socketUser, userSocket, userLobby} from '../user';

const lobby = {};

export default (socket) => {
    socket.on('lobby:new-game', (side, res) => {
        const id = uuid();
        const me = socketUser(socket);
        userLobby(me, id);
        lobby[id] = {
            id: id,
            players: [side ? undefined : me, side ? me : undefined],
            open: false,
            ready: false
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
        if(lobby[id].players[0] === me) {
            lobby[id].players[0] = undefined;
            if(lobby[id].players[1] === undefined) {
                delete lobby[id];
            } else {
                userSocket(lobby[id].players[1]).emit('lobby:update', lobby[id]);
            }
        } else if(lobby[id].players[1] === me) {
            lobby[id].players[1] = undefined;
            if(lobby[id].players[0] === undefined) {
                delete lobby[id];
            } else {
                userSocket(lobby[id].players[0]).emit('lobby:update', lobby[id]);
            }
        }
    };
    socket.on('lobby:leave-lobby', leaveLobby);
    socket.on('disconnect', leaveLobby);

    socket.on('lobby:invite-request', (who, res) => {
        const me = socketUser(socket);
        if(!me) { return res('Not logged in'); }
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
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
                            lobby[id].players[0] = who;
                        } else {
                            lobby[id].players[1] = who;
                        }
                        userLobby(who, id);
                        res(null, lobby[id]);
                        socket.emit('lobby:update', lobby[id]);
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
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        if(lobby[id].players[0] === undefined || lobby[id].players[1] === undefined) {
            lobby[id].players = [lobby[id].players[1], lobby[id].players[0]];
            res(null, true);
        } else {
            const otherSocket = lobby[id].players[0] === me
                                    ? userSocket(lobby[id].players[1])
                                    : userSocket(lobby[id].players[0]);
            otherSocket.emit('lobby:swap-request', (error, ok) => {
                if(error || !ok) {
                    res(null, false);
                } else {
                    lobby[id].players = [lobby[id].players[1], lobby[id].players[0]];
                    res(null, true);
                }
            });
        }
    });

    socket.on('lobby:cancel-search', (nil, res) => {
        const me = socketUser(socket);
        const id = userLobby(me);
        if(!lobby[id]) { return res('Not in a lobby'); }
        lobby[id].open = false;
        res && res(); // Call respond symbolically. The client isn't waiting
    });

    socket.on('lobby:search-for-match', (nil, res) => {
        const me = socketUser(socket);
        const mine = userLobby(me);
        if(!lobby[mine]) { return res('Not in a lobby'); }
        lobby[mine].open = false;
        for(let id of Object.keys(lobby)) {
            // Join the open room
            if(lobby[id].open) {
                lobby[id].open = false;
                if(lobby[id].players[0] === undefined) {
                    lobby[id].players[0] = me;
                    userSocket(lobby[id].players[1])
                        .emit('lobby:update', lobby[id]);
                } else if(lobby[id].players[1] === undefined) {
                    lobby[id].players[1] = me;
                    userSocket(lobby[id].players[0])
                        .emit('lobby:update', lobby[id]);
                } else { continue; }
                delete lobby[mine];
                userLobby(me, id);
                socket.emit('lobby:update', lobby[id]);
                return;
            }
        }
        // Or become the open room
        lobby[mine].open = true;
        res && res(); // Call respond symbolically. The client isn't waiting
    });
};