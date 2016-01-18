'use strict';

import {expect} from 'chai';

import connect from '../server/database.js';

describe('database.js', () => {
    it('should export a function', () => {
        expect(connect).to.be.an.instanceof(Function);
    });
    it('should run a promise based generator that is passed', (done) => {
        connect(function*() {
            yield Promise.resolve(1);
            yield Promise.resolve(2);
            yield Promise.resolve(3);
            done();
        });
    });
    it('should pass a query function to the generator', (done) => {
        connect(function*(query) {
            expect(query).to.be.an.instanceof(Function);
            yield Promise.resolve(1);
            done();
        });
    });
    describe('#query', () => {
        it('should return a promise', (done) => {
            connect(function*(query) {
                const q = query('SELECT 1 AS num');
                expect(q).to.be.an.instanceof(Promise);
                yield q;
                done();
            });
        });
        it('should resolve the promise with the rows array', (done) => {
            connect(function*(query) {
                const rows = yield query('SELECT 1 AS num');
                expect(rows).to.be.an.instanceof(Array);
                expect(rows[0].num).to.equal(1);
                done();
            });
        });
    });
});