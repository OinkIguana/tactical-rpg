'use strict';

import {stub} from 'sinon';
import {should as should_} from 'chai';
const should = should_();

import io from 'socket.io-client';

import {promisified, default as socket} from '../src/socket';

describe('socket.js', () => {
    it('should export the plain socket object by default', () => {
        socket.should.deep.equal(io());
    });
    describe('the promisifed socket object', () => {
        it('should have a promisified emit method that calls the regular one', () => {
            stub(socket, 'emit');
            promisified.emit().then.should.be.a('function');
            socket.emit.should.have.been.calledOnce;
            socket.emit.restore();
        });
        it('should have a promisified once method that calls the regular one', () => {
            stub(socket, 'once');
            promisified.once().then.should.be.a('function');
            socket.once.should.have.been.calledOnce;
            socket.once.restore();
        });
        it('should have the default on method', () => {
            promisified.on.should.deep.equal(socket.on);
        });
        it('should have the default removeListener method', () => {
            promisified.removeListener.should.deep.equal(socket.removeListener);
        });
        it('should have the default removeAllListeners method', () => {
            promisified.removeAllListeners.should.deep.equal(socket.removeAllListeners);
        });
    });
});