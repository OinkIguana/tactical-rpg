/*
    Provides better access to the game data than using the raw object
*/
'use strict';
import generate from './generator';
import {promisified as socket} from './socket';

const [RAW, PLAYER] = [Symbol('RAW'), Symbol('PLAYER')];
const [USERNAME] = [Symbol('USERNAME')];

export const PlayerData = class {
    constructor(raw) {
        this[RAW] = raw;
        socket.emit('query:find-username', this[RAW]['user-id'])
            .then((username) => this[USERNAME] = username);
    }
    get username() {
        return this[USERNAME];
    }
};

export const GameData = class {
    constructor(raw) {
        this[RAW] = raw;
        this[PLAYER] = raw.player.map((player) => new PlayerData(player));
    }
    get me() {
        return this[PLAYER][0].username === localStorage.getItem('rpg-username')
            ? this[PLAYER][0]
            : this[PLAYER][1];
    }
    get them() {
        return this[PLAYER][0].username !== localStorage.getItem('rpg-username')
            ? this[PLAYER][0]
            : this[PLAYER][1];
    }
    get state() {
        return this[RAW].state;
    }
    get startDate() { return this[RAW]['start-date']; }
    get lastPlayDate() { return this[RAW]['last-play-date']; }
};

export let game;

export const setGame = (data) => {
    game = new GameData(data);
};