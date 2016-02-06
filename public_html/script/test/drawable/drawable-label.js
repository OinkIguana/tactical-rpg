'use strict';

import {should as should_} from 'chai';
const should = should_();

import {spy, stub} from 'sinon';

import {Rect, Point} from '../../src/graphical-util';
import draw from '../../src/draw';
import {DrawableLabel, TextAlign, VerticalAlign} from '../../src/drawable/drawable-label';

describe('drawable-label.js', () => {
    const label = new DrawableLabel({frame: new Rect(20, 20, 400, 50), text: "Hello world"});
    describe('new DrawableLabel', () => {
        it('should return a valid DrawableLabel', () => {
            label.should.be.an.instanceof(DrawableLabel);
        });
    });
    describe('textStartFromAligns', () => {
        it('should return the correct position', () => {
            let fn = spy(draw, 'setFont');
            label.verticalAlign = VerticalAlign.top;
            label.textAlign = TextAlign.left;
            label.textStartFromAligns().should.deep.equal(label.frame.origin);
            label.verticalAlign = VerticalAlign.middle;
            label.textAlign = TextAlign.right;
            label.textStartFromAligns().should.deep.equal(new Point(label.frame.right, label.frame.center.y));
            label.verticalAlign = VerticalAlign.bottom;
            label.textAlign = TextAlign.center;
            label.textStartFromAligns().should.deep.equal(new Point(label.frame.center.x, label.frame.bottom));
            fn.should.have.been.calledThrice;
        });
    });
});
