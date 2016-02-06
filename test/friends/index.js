'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import friends from '../../server/friends';
import user from '../../server/user';

const SOCKET_ID = 'TESTING_SOCKET';
const [USER, PASS, EMAIL, VALIDATION_KEY] = [':)', ':)', 'a@b.c', 'TESTING_VALIDATION_KEY'];
const [BAD_USER, BAD_PASS, BAD_EMAIL, BAD_VALIDATION_KEY] = [':(', ':(', 'd@e.f', 'null'];
const [NEW_USER, NEW_PASS, NEW_EMAIL] = [':|', ':)', 'e@f.g'];

const socket = { on: stub(), emit: stub(), id: SOCKET_ID };

const events = {
    'friends:all-friends': [{
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call respond with an array', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].should.be.an.instanceof(Array);
                });
            });
        }
    }, {
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call respond with an array', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].should.be.an.instanceof(Array);
                });
            });
        }
    }],
    'friends:pending-requests': [{
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call respond with an array', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].should.be.an.instanceof(Array);
                });
            });
        }
    }, {
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call respond with an array', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].should.be.an.instanceof(Array);
                });
            });
        }
    }],
    'friends:send-request': [{
        args: BAD_USER,
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: BAD_USER,
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user doesn\'t exist', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: NEW_USER,
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe.skip('when the user is logged in and the second user does exist', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }],
    'friends:respond-request': [{
        args: {nameA: NEW_USER, response: true},
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {nameA: BAD_USER, response: true},
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user hasn\'t sent a request', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {nameA: NEW_USER, response: true},
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe.skip('when the user is logged in and the second user does exist', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should call respond with the other user\'s online state', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][1].to.be.false;
                });
            });
        }
    }],
    'friends:unfriend': [{
        args: NEW_USER,
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: NEW_USER,
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user is a friend', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }, {
        args: BAD_USER,
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user is not a friend', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }],
    'friends:chat-message': [{
        args: {username: USER, message: 'Hello!'},
        tests(response) {
            describe('when the user is not logged in', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {username: NEW_USER, message: 'Hello!'},
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user is offline', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {username: NEW_USER, message: 'Hello!'},
        before() {
            user.addUser(USER, {socket: socket, id: 1});
            user.addUser(NEW_USER, {socket: socket, id: 2});
        },
        after() {
            user.removeUser(USER);
            user.removeUser(NEW_USER);
        },
        tests(response) {
            describe('when the user is logged in and the second user is online', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should emit back to the other socket', () => {
                    socket.emit.should.have.been.calledOnce;
                    socket.emit.should.have.been.calledWith('friends:chat-message', {username: USER, message: 'Hello!'});
                });
            });
        }
    }]
};

describe('friends', () => {
    before(() => {
        // Initialize the fake socket with the friend events
        friends(socket);
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