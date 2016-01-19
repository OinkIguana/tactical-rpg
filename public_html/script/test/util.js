'use strict';

import {should as should_} from 'chai';
let should = should_();

import util from '../src/util.js';

describe('util.js', () => {
    describe('Sequence', () => {
        const list = [1, 2, 3, 4, 5, 4, 3, 2];
        const x = new util.Sequence(...list);

        it('should be constructed with new Sequence(...elements)', () => {
            (() => util.Sequence()).should.throw(TypeError);
            new util.Sequence(...list).should.be.an('object');
        });

        it('should be an iterator', () => {
            x.next().value.should.equal(list[0]);
            x.next().value.should.equal(list[1]);
            x.next().value.should.equal(list[2]);
            x.next().value.should.equal(list[3]);
        });
        it('should be iterable', () => {
            [...x].should.deep.equal(list);
        });

        describe('#operator[i]', () => {
            if(window.Proxy !== undefined) {
                it('should allow access to the inner array', () => {
                    x[3].should.equal(list[3]);
                });
                it('should produce the correct value at any index', () => {
                    x[3].should.equal(list[3]);
                    x[10].should.equal(list[10 % list.length]);
                    x[-5].should.equal(list[list.length - 5]);
                });
            } else { it('this browser does not support Proxy'); }
        });

        describe('#operator[i]=', () => {
            if(window.Proxy !== undefined) {
                it('should change the inner array', () => {
                    (x[3] = 5).should.equal(5);
                    x[3].should.equal(5);
                    (x[3] = (4)).should.equal(4);
                    x[3].should.equal(4);
                });
            } else { it('this browser does not support Proxy'); }
        });

        describe('#current', () => {
            it('should return the current element, without changing it', () => {
                x.current.should.equal(list[4]);
            });
            it('should be read only', () => {
                (() => x.current = (3)).should.throw(TypeError);
            });
        });
        describe('#index', () => {
            it('should return the current index (less than length)', () => {
                x.index.should.equal(4);
            });
        });
        describe('#index=', () => {
            it('should change the current index', () => {
                (x.index = 5).should.equal(5);
                (x.index = 10).should.equal(10);
                x.index.should.equal(10 % x.length);
            });
        });

        describe('#length', () => {
            it('should return the number of items in the sequence', () => {
                x.length.should.equal(list.length);
            });
            it('should be read only', () => {
                (() => x.length = 5).should.throw(TypeError);
            });
        });

        describe('#infinite()', () => {
            it('should be iterable and never stop', () => {
                let n = 0;
                for(let item of x.infinite()) {
                    item.should.be.a('number');
                    n++;
                    if(n > 100) break;
                }
            });
        });
    });

    describe('Range', () => {
        const [min, max] = [10, 20];
        const [all, nat, even, odd] = [
            new util.Range(min, max, 0),
            new util.Range(min, max),
            new util.Range(min, max, 2),
            new util.Range(min + 1, max, 2)
        ];

        it('should be constructed with new Range(min, max, step = 1)', () => {
            (() => util.Range()).should.throw(TypeError);
            new util.Range(min, max, 2).should.be.an('object');
        });

        it('should be iterable', () => {
            [...nat].should.deep.equal([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
            [...even].should.deep.equal([10, 12, 14, 16, 18]);
        });

        it('should not be iterable with step = 0', () => {
            (() => [...all]).should.throw(TypeError);
        });

        describe('#operator in', () => {
            if(window.Proxy !== undefined) {
                it('should include min', () => {
                    (nat.min in nat).should.be.true;
                    (even.min in even).should.be.true;
                    (odd.min in odd).should.be.true;
                    (all.min in all).should.be.true;
                });

                it('should not include max', () => {
                    (nat.max in nat).should.be.false;
                    (even.max in even).should.be.false;
                    (odd.max in odd).should.be.false;
                    (all.max in all).should.be.false;
                });

                it('should include intermediate values', () => {
                    (15 in nat).should.be.true;
                    (16 in even).should.be.true;
                    (17 in odd).should.be.true;
                    (10 + Math.PI in all).should.be.true;
                });

                it('should not include values that are stepped over', () => {
                    (15.5 in nat).should.be.false;
                    (15 in even).should.be.false;
                    (16 in odd).should.be.false;
                });

                it('should not include values out of the range', () => {
                    (5 in nat).should.be.false;
                    (6 in even).should.be.false;
                    (5 in odd).should.be.false;
                    (5 in all).should.be.false;

                    (25 in nat).should.be.false;
                    (26 in even).should.be.false;
                    (25 in odd).should.be.false;
                    (25 in all).should.be.false;
                });
            } else { it('this browser does not support Proxy'); }
        });

        describe('#min', () => {
            it('should return the minimum value (in the range)', () => {
                nat.min.should.equal(min);
                even.min.should.equal(min);
                odd.min.should.equal(min + 1);
                all.min.should.equal(min);
            });
        });
        describe('#min=', () => {
            it('should change the min value', () => {
                nat.min = 3;
                nat.min.should.equal(3);
                nat.min = min;
                nat.min.should.equal(min);
            });
        });

        describe('#max', () => {
            it('should return the maximum value (not in the range)', () => {
                nat.max.should.equal(max);
                even.max.should.equal(max);
                odd.max.should.equal(max);
                all.max.should.equal(max);
            });
        });
        describe('#max=', () => {
            it('should change the max value', () => {
                nat.max = 3;
                nat.max.should.equal(3);
                nat.max = max;
                nat.max.should.equal(max);
            });
        });

        describe('#step', () => {
            it('should return the step of the range', () => {
                nat.step.should.equal(1);
                even.step.should.equal(2);
                odd.step.should.equal(2);
                all.step.should.equal(0);
            });
        });
        describe('#step=', () => {
            it('should change the step amount', () => {
                nat.step = 3;
                nat.step.should.equal(3);
                nat.step = 1;
                nat.step.should.equal(1);
            });
        });

        describe('#length', () => {
            it('should return the number of elements in the range', () => {
                nat.length.should.equal(10);
                even.length.should.equal(5);
                odd.length.should.equal(5);
                all.length.should.equal(Infinity);
            });

            it('should be read only', () => {
                (() => nat.length = 15).should.throw(TypeError);
            });
        });

        describe('#constrain(x)', () => {
            it('should return x as the nearest element in the range', () => {
                nat.constrain(15.2).should.equal(15);
                even.constrain(15.2).should.equal(16);
                odd.constrain(15.2).should.equal(15);
                all.constrain(15.2).should.equal(15.2);

                nat.constrain(30).should.equal(20);
                even.constrain(30).should.equal(20);
                odd.constrain(30).should.equal(20);
                all.constrain(30).should.equal(20);

                nat.constrain(5).should.equal(10);
                even.constrain(5).should.equal(10);
                odd.constrain(5).should.equal(11);
                all.constrain(5).should.equal(10);
            });
        });
    });

    describe('range(min, max, step = 0)', () => {
        it('should do the same as new Range(min, max, step = 0)', () => {
            util.range(0, 10, 2).should.deep.equal(new util.Range(0, 10, 2));
        });
    });

    describe('pad(str, len, char = \'\')', () => {
        it('should pad str with char at the front up to length len', () => {
            util.pad('str', 7, 'x').should.equal('xxxxstr');
            util.pad('str', 5, 'x').should.equal('xxstr');
            util.pad('str', 3, 'x').should.equal('str');
        });
        it('should throw an error if no char is provided', () => {
            (() => util.pad('str', 5)).should.throw(TypeError);
            (() => util.pad('str')).should.throw(TypeError);
        });
    });
});