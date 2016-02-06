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
    on(...args) { return socket.on(...args); },
    removeListener(...args) { return socket.removeListener(...args); },
    removeAllListeners(...args) { return socket.removeAllListeners(...args); }
};

export default socket;

