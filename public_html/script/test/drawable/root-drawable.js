'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {spy, stub} from 'sinon';

import {Rect} from '../../src/graphical-util';
import canv from '../../src/canvas';
import draw from '../../src/draw';
import RootDrawable from '../../src/drawable/root-drawable';
import Drawable from '../../src/drawable/drawable';

describe('root-drawable.js', () => {
    const root = new RootDrawable({frame: new Rect(0, 0, 300, 45), canvasID: 1});
    describe('new RootDrawable', () => {
        it('should return a valid RootDrawable', () => {
            root.should.be.an.instanceof(RootDrawable);
        });
    });

    describe('draw', () => {
        it('should throw if the object has a bad or nonexistent canvasID', () => {
            root.canvasID = undefined;
            root.draw.should.throw(Error);
            let fn = stub(canv, 'setCanvas');
            fn.returnsArg(0);
            root.canvasID = 'game';
            root.draw.should.not.throw;
            root.canvasID = undefined;
            root.draw.should.throw(Error);
            fn.restore();
        });
    });

    describe('getRootDrawable', () => {
        const child = new Drawable({frame: new Rect(0,0,23,23)});
        root.addChild(child);
        const grandchild = new Drawable({frame: new Rect(2,2,12,12)});
        child.addChild(grandchild);
        it('should return the RootDrawable if it\'s called on a child', () => {
            grandchild.getRootDrawable().should.deep.equal(root);
            child.getRootDrawable().should.deep.equal(root);
        });
        it('should return undefined if it\'s called on a drawable not in the hierarchy', () => {
            child.removeFromParent();
            should.not.exist(grandchild.getRootDrawable());
        });
    });
});
