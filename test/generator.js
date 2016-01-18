'use strict';

import {expect} from 'chai';

import generate from '../server/generator.js';

describe('generator.js', () => {
    it('should run a generator that yields promises', (done) => {
        generate(function*() {
            let x = 0;
            x = yield new Promise((res) => res(1));
            x = yield new Promise((res) => res(2));
            x = yield new Promise((res) => res(3));
            expect(x).to.equal(3);
            done();
        });
    });
    it('should return a promise that resolves with the final value', (done) => {
        generate(function*() {
            let x = 0;
            x = yield new Promise((res) => res(1));
            x = yield new Promise((res) => res(2));
            x = yield new Promise((res) => res(3));
            return x;
        }).then((x) => {
            expect(x).to.equal(3);
            done();
        });
    });
    it('should pass the resolved value to gen.next()', (done) => {
        generate(function*() {
            let x = 0;
            expect(yield new Promise((res) => res(1))).to.equal(1);
            expect(yield new Promise((res) => res([1, 2]))).to.be.an.instanceof(Array);
            done();
        });
    });
    it('should throw if the yielded Promise is rejected', (done) => {
        generate(function*() {
            let x;
            try {
                x = yield new Promise((res) => res(1));
                x = yield new Promise((res) => res(2));
                x = yield new Promise((res, rej) => rej(4));
            } catch(e) {
                x = yield new Promise((res) => res(3));
                expect(x).to.equal(3);
                expect(e).to.equal(4);
            } finally {
                done();
            }
        });
    });
    it('should return a Promise which is rejected if the generator throws', (done) => {
        generate(function*() {
            let x;
            x = yield new Promise((res) => res(1));
            x = yield new Promise((res) => res(2));
            if(x == 2) { throw x; }
            x = yield new Promise((res) => res(3));
            // Should not reach this point
            expect(false).to.be.true;
        }).catch((x) => {
            expect(x).to.equal(2);
            done();
        });
    });
});