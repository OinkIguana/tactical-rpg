'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import query from '../../server/query';

const [USER, BAD_USER] = [':)', ':('];

const socket = { on: stub() };

const events = {
    'query:user-exists': [{
        args: USER,
        tests(response) {
            describe('when the user exists,', () => {
                it('should call response with (null,true)', () => {
                    response.should.have.been.calledOnce;
                    response.args[0].should.deep.equal([null, true]);
                });
            });
        }
    }, {
        args: BAD_USER,
        tests(response) {
            describe('when the user does not exist,', () => {
                it('should call response with (null,false)', () => {
                    response.should.have.been.calledOnce;
                    response.args[0].should.deep.equal([null, false]);
                });
            });
        }
    }],
    'query:find-username': [{
        args: 1,
        tests(response) {
            describe('when the user exists,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call response with the username', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].should.be.a('string');
                });
            });
        }
    }, {
        args: -1,
        tests(response) {
            describe('when the user does not exist,', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }]
};

describe('query', () => {
    before(() => {
        // Initialize the fake socket with the query events
        query(socket);
    });
    describe('should create a handler for each of:', () => {
        Object.keys(events).forEach((eventName) => {
            describe(`'${eventName}', which,`, () => {
                events[eventName].forEach((set) => {
                    const response = spy();

                    // Run the callback before the tests are run
                    before((done) => {
                        set.before && set.before();
                        // Find the corresponding callback
                        for(let i = 0; i < socket.on.callCount; i++) {
                            if(socket.on.args[i][0] === eventName) {
                                // And call it
                                socket.on.args[i][1](set.args, (...res) => {response(...res); done();});
                                break;
                            }
                        }
                    });
                    beforeEach(() => set.beforeEach && set.beforeEach());
                    afterEach(() => set.afterEach && set.afterEach());
                    after(() => set.after && set.after());

                    // Prepare the tests
                    set.tests && set.tests(response);
                });
            });
        });
    });
});