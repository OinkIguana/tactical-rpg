'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';
import nodemailer from 'nodemailer';

import login from '../server/login';

const [USER, PASS, EMAIL] = [':)', ':)', 'a@b.c'];
const [BAD_USER, BAD_PASS, BAD_EMAIL] = [':(', ':(', 'd@e.f'];

const socket = { on: stub() };
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
        tests(response) {
            describe('when the credentials are correct,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
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
            describe('when the user exists already,', () => {
                it('should call response with an error message', () => {
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
        },
        tests(response) {
            describe('when the username and email are correct,', () => {
                it('should call response with no errors', () => {
                    response.should.have.been.calledOnce;
                    should.not.exist(response.args[0][0]);
                });
                it('should try to send an email', () => {
                    this.beforeCount.should.equal(stubmailer.callCount - 1);
                    stubmailer.should.have.been.calledOnce;
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
    'login:user-exists': [{
        args: {username: USER},
        tests(response) {
            describe('when the user exists,', () => {
                it('should call response with (null,true)', () => {
                    response.should.have.been.calledOnce;
                    response.args[0].should.deep.equal([null, true]);
                });
            });
        }
    }, {
        args: {username: BAD_USER},
        tests(response) {
            describe('when the user does not exist,', () => {
                it('should call response with (null,false)', () => {
                    response.should.have.been.calledOnce;
                    response.args[0].should.deep.equal([null, false]);
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
            describe(`- '${eventName}', which,`, () => {
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