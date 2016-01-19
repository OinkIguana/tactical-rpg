'use strict';

import {should as should_} from 'chai';
let should = should_();
import connect from '../server/database.js';

describe('database.js', () => {
    it('should export a function', () => {
        connect.should.be.an.instanceof(Function);
    });
    it('should run a promise based generator that is passed', () => {
        return connect(function*() {
            yield Promise.resolve(1);
            yield Promise.resolve(2);
            yield Promise.resolve(3);
        }).should.eventually.be.fulfilled;
    });
    it('should pass a query function to the generator', () => {
        return connect(function*(query) {
            query.should.be.an.instanceof(Function);
            yield Promise.resolve(1);
        }).should.eventually.be.fulfilled;
    });
    it('should return a promise', () => {
        connect(function*(query) {yield Promise.resolve();}).should.be.an.instanceof(Promise);
    });
    it('should resolve with the return value of the passed generator', () => {
        return connect(function*(query) {
            yield Promise.resolve(1);
            return 15;
        }).should.eventually.become(15);
    });
    describe('#query', () => {
        it('should return a promise', () => {
            return connect(function*(query) {
                const q = query('SELECT 1 AS num');
                q.should.be.an.instanceof(Promise);
                yield q;
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with the row if there is only one row', () => {
            return connect(function*(query) {
                const row = yield query('SELECT 1 AS num');
                row.should.be.an.instanceof(Object);
                row.num.should.equal(1);
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with the rows array if there are multiple', () => {
            return connect(function*(query) {
                const rows = yield query('SELECT * FROM generate_series(2,4) AS num;');
                rows.should.be.an.instanceof(Array);
                rows[0].num.should.to.equal(2);
            }).should.eventually.be.fulfilled;
        });
        it('should reject the promise if no rows are matched', () => {
            return connect(function*(query) {
                try {
                    const rows = yield query('SELECT user_id FROM accounts WHERE user_id = -5');
                } catch(e) {
                    e.should.be.instanceof(Error);
                }
            }).should.eventually.be.fulfilled;
        });
    });
});