/*
    Promisifies and shares the Socket between modules
*/
'use strict';
import io from 'socket.io-client';

const socket = io();

export const promisified = {
    emit(event, data) {
        return new Promise((resolve, reject) => {
            socket.emit(event, data, (error, value) => {
                if(!!error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            });
        });
    },
    once(event) {
        return new Promise((resolve, reject) => {
            socket.once(event, (error, value) => {
                if(!!error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            });
        });
    },
    // Non-promisifiable functions just pass through
    get on() { return socket.on; },
    get removeListener() { return socket.removeListener; },
    get removeAllListeners() { return socket.removeAllListeners; }
};

export default socket;

