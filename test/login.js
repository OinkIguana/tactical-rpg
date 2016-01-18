'use strict';

import {expect} from 'chai';
import {spy, stub} from 'sinon';

import login from '../server/login';

const [USER, PASS, EMAIL] = [':)', ':)', 'a@b.c'];
const [BAD_USER, BAD_PASS, BAD_EMAIL] = [':(', ':(', 'd@e.f'];

describe('login', () => {
    const events = {
        'login:login': [{
            args: {username: USER, password: PASS},
            tests(response) {
                it('should call response with no errors', () => {
                    expect(response).to.have.been.calledOnce;
                    expect(response.args[0][0]).to.be.null;
                });
            }
        }],
        'login:sign-up': [{
            args: {username: USER, password: PASS, email: EMAIL},
            tests(response) {
                it('should call response with no errors', () => {
                    expect(response).to.have.been.calledOnce;
                    expect(response.args[0][0]).to.be.null;
                });
            }
        }],
        'login:forgot-password': [{
            args: {username: USER, email: EMAIL},
            tests(response) {
                it('should call response with no errors', () => {
                    expect(response).to.have.been.calledOnce;
                    expect(response.args[0][0]).to.be.null;
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
                    before(() => {
                        // Find the corresponding callback
                        for(let i = 0; i < socket.on.callCount; i++) {
                            if(socket.on.args[i][0] === event) {
                                // And call it
                                socket.on.args[i][1](args, response);
                                break;
                            }
                        }
                    });
                });
            });
        });
    });
});