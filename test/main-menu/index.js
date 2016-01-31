'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import mainMenu from '../../server/main-menu';
import user from '../../server/user';

const SOCKET_ID = 'TESTING_SOCKET';
const [USER, PASS, EMAIL, VALIDATION_KEY] = [':)', ':)', 'a@b.c', 'TESTING_VALIDATION_KEY'];
const [BAD_USER, BAD_PASS, BAD_EMAIL, BAD_VALIDATION_KEY] = [':(', ':(', 'd@e.f', 'null'];
const [NEW_USER, NEW_PASS, NEW_EMAIL] = [':))', ':)', 'e@f.g'];

const socket = { on: stub(), id: SOCKET_ID };

const events = {
    'main-menu:logout': [{
        before() {
            user.addUser(USER, socket);
        },
        tests(response) {
            it('should respond with no errors', () => {
                response.should.have.been.calledOnce;
                should.not.exist(response.args[0][0]);
            });
            it('should remove the user from the connected users', () => {
                should.not.exist(user.socketUser(socket));
            });
        }
    }],
    'main-menu:change-password': [{
        args: {old: PASS, password: NEW_PASS},
        tests(response) {
            describe('when a socket is not logged in', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {old: BAD_PASS, password: PASS},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and the old password is incorrect', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {old: PASS, password: PASS},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and the old password is correct', () => {
                it('should respond with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }],
    'main-menu:change-username': [{
        args: {username: USER},
        tests(response) {
            describe('when a socket is not logged in', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {username: NEW_USER},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and username is taken', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {username: USER},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and the username is not taken', () => {
                it('should respond with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }],
    'main-menu:change-email': [{
        args: {email: EMAIL},
        tests(response) {
            describe('when a socket is not logged in', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {email: NEW_EMAIL},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and email is taken', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.exist;
                });
            });
        }
    }, {
        args: {email: EMAIL},
        before() {
            user.addUser(USER, socket);
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when a socket is logged in and the email is not taken', () => {
                it('should respond with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }]
};

describe('main-menu', () => {
    before(() => {
        // Initialize the fake socket with the login events
        mainMenu(socket);
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