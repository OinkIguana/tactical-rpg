'use strict';

import {spy, stub} from 'sinon';
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
        it('should pass through to the default on method', () => {
            stub(socket, 'on');
            const cb = spy();
            promisified.on('test', cb);
            socket.on.should.have.been.calledWith('test', cb);
            socket.on.restore();
        });
        it('should pass through to the default removeListener method', () => {
            stub(socket, 'removeListener');
            const cb = spy();
            promisified.removeListener('test', cb);
            socket.removeListener.should.have.been.calledWith('test', cb);
            socket.removeListener.restore();
        });
        it('should pass through to the default removeAllListeners method', () => {
            stub(socket, 'removeAllListeners');
            promisified.removeAllListeners('test');
            socket.removeAllListeners.should.have.been.calledWith('test');
            socket.removeAllListeners.restore();
        });
    });
});