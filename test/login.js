'use strict';

import {should as should_} from 'chai';
let should = should_();
import {spy, stub} from 'sinon';

import login from '../server/login';

const [USER, PASS, EMAIL] = [':)', ':)', 'a@b.c'];
const [BAD_USER, BAD_PASS, BAD_EMAIL] = [':(', ':(', 'd@e.f'];

describe('login', () => {
    const events = {
        'login:login': [{
            args: {username: USER, password: PASS},
            tests(response) {
                it('should call response with no errors when credentials are right', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            }
        }, {
            args: {username: USER, password: BAD_PASS},
            tests(response) {
                it('should call response with an error message when the password is wrong', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            }
        }, {
            args: {username: BAD_USER, password: PASS},
            tests(response) {
                it('should call response with an error message when the username is wrong', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            }
        }],
        'login:sign-up': [{
            args: {username: USER, password: PASS, email: EMAIL},
            tests(response) {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            }
        }],
        'login:forgot-password': [{
            args: {username: USER, email: EMAIL},
            tests(response) {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            }
        }]
    };
    const socket = {
        on: stub()
    };
    before(() => {
        // Initialize the fake socket with the login events
        login(socket);
    });
    describe('should create a handler for each of:', () => {
        Object.keys(events).forEach((event) => {
            describe(`${event}, which`, () => {
                events[event].forEach(({args, tests}) => {
                    const response = spy();
                    // Prepare the tests
                    tests(response);

                    // Run the callback before the tests are run
                    before((done) => {
                        // Find the corresponding callback
                        for(let i = 0; i < socket.on.callCount; i++) {
                            if(socket.on.args[i][0] === event) {
                                // And call it
                                socket.on.args[i][1](args, (...res) => {response(...res); done();});
                                break;
                            }
                        }
                    });
                });
            });
        });
    });
});