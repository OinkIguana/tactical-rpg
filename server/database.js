/*
    Abstraction around database access
*/
'use strict';
import pg from 'pg';

import {DB_URL, DB_HASHKEY} from './config';
import generate from './generator';

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
    generate(function*() {
        let result;
        try {
            const [client, close] = yield connect();
            try {
                result = yield* generator((query) => {
                    return new Promise((resolve, reject) => {
                        client.query(query, (error, result) => {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(result.rows);
                            }
                        });
                    });
                });
            } catch(error) {
                console.error('Generator encountered an unhandled error:', error);
            } finally {
                close();
            }
        } catch(error) {
            console.error('Could not connect to PostgreSQL:', error);
        } finally {
            return result;
        }
    });
};