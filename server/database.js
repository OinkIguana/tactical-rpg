/*
    Abstraction around database access
*/
'use strict';
import pg from 'pg';

import {DB_URL} from './config';
import generate from './generator';

// Error to represent database errors
const DatabaseError = class extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'DatabaseError';
    }
};

const connect = () => {
    return new Promise((resolve, reject) => {
        pg.connect(DB_URL, (err, client, close) => {
            if(err) {
                reject(err);
            } else {
                resolve([client, close]);
            }
        });
    });
};

export default (generator) => {
    return generate(function*() {
        let result;
        const [client, close] = yield connect(); // Errors are handled by generate
        try {
            result = yield* generator({
                query(query) {
                    return new Promise((resolve, reject) => {
                        client.query(query, (error, result) => {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(result.rows);
                            }
                        });
                    });
                },
                exists(query) {
                    return new Promise((resolve, reject) => {
                        client.query(query, (error, result) => {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(!!result.rowCount);
                            }
                        });
                    });
                },
                count(query) {
                    return new Promise((resolve, reject) => {
                        client.query(query, (error, result) => {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(result.rowCount);
                            }
                        });
                    });
                }
            });
        } catch(error) {
            throw error; // Propagate errors
        } finally {
            close();
            return result;
        }
    });
};