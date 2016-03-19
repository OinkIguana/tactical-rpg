'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import user from '../../server/user';
import lobby from '../../server/lobby';

const SOCKET_ID = 'TESTING_SOCKET';
const [USER, PASS, EMAIL, VALIDATION_KEY] = [':)', ':)', 'a@b.c', 'TESTING_VALIDATION_KEY'];
const [USER_2, BAD_PASS, BAD_EMAIL, BAD_VALIDATION_KEY] = [':(', ':(', 'd@e.f', 'null'];
const [NEW_USER, NEW_PASS, NEW_EMAIL] = [':|', ':)', 'e@f.g'];
const LOBBY_ID = 'LOBBY_ID';

const socket = { on: stub(), id: SOCKET_ID };

const events = {
    'lobby:new-game': [ {
        args: false,
        tests(response) {
            describe('when not signed in', () => {
                it('should respond with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: false,
        before() {
            user.addUser(USER, {socket: socket, id: 1});
        },
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when signed in', () => {
                it('should respond with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should respond with a lobby id', () => {
                    response.args[0][1].should.be.a('string');
                });
                it('should assign the user its lobby id', () => {
                    user.userLobby(USER).should.equal(response.args[0][1]);
                });
            });
        }
    }],
    'lobby:leave-lobby': [{
        tests(response) {
            describe('when signed in', () => {
                it('should respond with nothing', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }]
};

describe('lobby', () => {
    before(() => {
        // Initialize the fake socket with the menu events
        lobby(socket);
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