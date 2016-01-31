'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import nodemailer from 'nodemailer';
import uuid from 'node-uuid';
import login from '../../server/login';
import user from '../../server/user';

const SOCKET_ID = 'TESTING_SOCKET';
const [USER, PASS, EMAIL, VALIDATION_KEY] = [':)', ':)', 'a@b.c', 'TESTING_VALIDATION_KEY'];
const [BAD_USER, BAD_PASS, BAD_EMAIL, BAD_VALIDATION_KEY] = [':(', ':(', 'd@e.f', 'null'];
const [NEW_USER, NEW_PASS, NEW_EMAIL] = ['test_a', 'secretpassword', 'test@test.com'];

const socket = { on: stub(), id: SOCKET_ID };
const sendMail = {
    sendMail() { return Promise.resolve(); }
};
const stubmailer = stub(nodemailer, 'createTransport').returns(sendMail);
after(() => {
    stubmailer.restore();
});

const events = {
    'login:login': [{
        args: {username: USER, password: PASS},
        after() {
            user.removeUser(USER);
        },
        tests(response) {
            describe('when the credentials are correct,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should add the user to the currently connected users', () => {
                    user.socketUser(socket).should.equal(USER);
                });
            });
        }
    }, {
        args: {username: USER, password: BAD_PASS},
        tests(response) {
            describe('when the password is incorrect,', () => {
                it('should call response with an error message', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {username: BAD_USER, password: PASS},
        tests(response) {
            describe('when the username is incorrect,', () => {
                it('should call response with an error message', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }],
    'login:sign-up': [{
        args: {username: USER, password: PASS, email: EMAIL},
        tests(response) {
            describe.skip('when the information is valid,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }, {
        args: {username: USER, password: PASS, email: EMAIL},
        tests(response) {
            describe('when the user exists already,', () => {
                it('should call response with an error message', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {username: BAD_USER, password: BAD_PASS, email: BAD_EMAIL},
        tests(response) {
            describe('when the new account values are not valid,', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }],
    'login:forgot-password': [{
        args: {username: USER, email: EMAIL},
        before() {
            this.beforeCount = stubmailer.callCount;
            stub(uuid, 'v4').returns(VALIDATION_KEY);
        },
        after() {
            uuid.v4.restore();
        },
        tests(response) {
            describe('when the username and email are correct,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it.skip('should try to send an email', () => {
                    this.beforeCount.should.equal(stubmailer.callCount - 1);
                });
            });
        }
    }, {
        args: {username: BAD_USER, email: EMAIL},
        before() {
            this.beforeCount = stubmailer.callCount;
        },
        tests(response) {
            describe('when the user does not exist,', () => {
                it('should call response with an error message', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
                it('should not try to send an email', () => {
                    stubmailer.callCount.should.equal(this.beforeCount);
                });
            });
        }
    }, {
        args: {username: USER, email: BAD_EMAIL},
        before() {
            this.beforeCount = stubmailer.callCount;
        },
        tests(response) {
            describe('when the email is incorrect,', () => {
                it('should call response with an error message', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
                it('should not try to send an email', () => {
                    stubmailer.callCount.should.equal(this.beforeCount);
                });
            });
        }
    }],
    'login:reset-password': [{
        args: {username: USER, password: PASS, validation_key: VALIDATION_KEY},
        tests(response) {
            describe('when the username and validation_key are correct,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
            });
        }
    }, {
        args: {username: BAD_USER, password: PASS, validation_key: VALIDATION_KEY},
        tests(response) {
            describe('when the username is incorrect,', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }, {
        args: {username: USER, password: PASS, validation_key: BAD_VALIDATION_KEY},
        tests(response) {
            describe('when the validation_key is incorrect,', () => {
                it('should call response with an error', () => {
                    response.should.have.been.calledOnce;
                    response.args[0][0].should.be.a('string');
                });
            });
        }
    }]
};

describe('login', () => {
    before(() => {
        // Initialize the fake socket with the login events
        login(socket);
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