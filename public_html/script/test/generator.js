'use strict';

import {should as should_} from 'chai';
let should = should_();

import generate from '../src/generator.js';

describe('generator.js', () => {
    it('should run a generator that yields promises', () => {
        return generate(function*() {
            yield new Promise((res) => res(1));
            yield new Promise((res) => res(2));
            yield new Promise((res) => res(3));
        }).should.eventually.be.fulfilled;
    });
    it('should return a promise that resolves with the final value', () => {
        return generate(function*() {
            let x = 0;
            x = yield new Promise((res) => res(1));
            x = yield new Promise((res) => res(2));
            x = yield new Promise((res) => res(3));
            return x;
        }).should.eventually.become(3);
    });
    it('should pass the resolved value to gen.next()', () => {
        return generate(function*() {
            (yield new Promise((res) => res(1))).should.equal(1);
            (yield new Promise((res) => res([1, 2]))).should.be.an.instanceof(Array);
        }).should.eventually.be.fulfilled;
    });
    it('should throw if the yielded Promise is rejected', () => {
        return generate(function*() {
            let x;
            try {
                x = yield new Promise((res) => res(1));
                x = yield new Promise((res) => res(2));
                x = yield new Promise((res, rej) => rej(4));
            } catch(e) {
                x = yield new Promise((res) => res(3));
                x.should.equal(3);
                e.should.equal(4);
            }
        });
    });
    it('should return a Promise which is rejected if the generator throws', () => {
        return generate(function*() {
            let x;
            x = yield new Promise((res) => res(1));
            x = yield new Promise((res) => res(2));
            if(x == 2) { throw x; }
            x = yield new Promise((res) => res(3));
            // Should not reach this point
            false.should.be.true;
        }).should.eventually.be.rejectedWith(2);
    });
});