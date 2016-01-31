'use strict';

import {should as should_} from 'chai';
const should = should_();
import pg from 'pg';
import {spy, stub} from 'sinon';
import connect from '../server/database.js';


describe('database.js', () => {
    let pgspy;
    beforeEach(() => {
        pgspy = spy(pg, 'connect');
    });
    afterEach(() => {
        pgspy.restore();
    });
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
    it('should return a promise', () => {
        connect(function*(query) {yield Promise.resolve();}).should.be.an.instanceof(Promise);
    });
    it('should resolve with the return value of the passed generator', () => {
        return connect(function*(query) {
            yield Promise.resolve(1);
            return 15;
        }).should.eventually.become(15);
    });
    it('should open a connection to the database', () => {
        return connect(function*(query) {
            yield query.query('SELECT 1 AS num');
        }).then(() => {
            pgspy.should.have.been.calledOnce;
        }).should.eventually.be.resolved;
    });
    it('should call close', () => {
        const close = spy();
        pgspy.restore();
        pgspy = stub(pg, 'connect').returns(
            Promise.resolve([{
                query() {
                    return Promise.resolve([{num: 1}]);
                }
            }, close]));
        return connect(function*(query) {
            yield query.query('SELECT 1 AS num');
        }).then(() => {
            close.should.have.been.calledOnce;
        }).should.eventually.be.resolved;
    });
    it('should pass a set of query functions to the generator', () => {
        return connect(function*(query) {
            query.should.be.an.instanceof(Object);
            query.query.should.be.an.instanceof(Function);
            query.count.should.be.an.instanceof(Function);
            query.exists.should.be.an.instanceof(Function);
            yield Promise.resolve(1);
        }).should.eventually.be.fulfilled;
    });
    describe('#query', () => {
        it('should return a promise', () => {
            return connect(function*({query}) {
                const q = query('SELECT 1 AS num');
                q.should.be.an.instanceof(Promise);
                yield q;
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with the rows array', () => {
            return connect(function*({query}) {
                const rows = yield query('SELECT * FROM generate_series(2,4) AS num;');
                rows.should.be.an.instanceof(Array);
                rows[0].num.should.equal(2);
            }).should.eventually.be.fulfilled;
        });
    });
    describe('#exists', () => {
        it('should return a promise', () => {
            return connect(function*({exists}) {
                const q = exists('SELECT 1 AS num');
                q.should.be.an.instanceof(Promise);
                yield q;
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with true if a row exists', () => {
            return connect(function*({exists}) {
                (yield exists('SELECT * FROM generate_series(2,4) AS num WHERE num = 3;')).should.be.true;
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with false if a row does not exist', () => {
            return connect(function*({exists}) {
                (yield exists('SELECT * FROM generate_series(2,4) AS num WHERE num = 5;')).should.be.false;
            }).should.eventually.be.fulfilled;
        });
    });
    describe('#count', () => {
        it('should return a promise', () => {
            return connect(function*({count}) {
                const q = count('SELECT 1 AS num');
                q.should.be.an.instanceof(Promise);
                yield q;
            }).should.eventually.be.fulfilled;
        });
        it('should resolve the promise with the number of rows matched', () => {
            return connect(function*({count}) {
                (yield count('SELECT * FROM generate_series(2,4) AS num')).should.equal(3);
            }).should.eventually.be.fulfilled;
        });
    });
});