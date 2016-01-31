'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {Rect} from '../../src/util.js';
import Drawable from '../../src/drawable/drawable.js';

describe('drawable.js', () => {
    const drawable = new Drawable({frame: new Rect(20, 20, 400, 300)});
    describe('new Drawable({frame})', () => {
        it('should throw a TypeError is frame is not a Rect', () => {
            const typeError = () => { let d = new Drawable({frame: 12});};
            typeError.should.throw(TypeError);
        });
        it('should return a valid Drawable', () => {
            drawable.should.be.an.instanceof(Drawable);
        });
    });
    describe('Drawable.children', () => {
        const parent = new Drawable({frame: new Rect(20, 20, 40, 30)});
        const bottom = new Drawable({frame: new Rect(20, 20, 40, 30)});
        bottom.zIndex = 0;
        const middle = new Drawable({frame: new Rect(20, 20, 40, 30)});
        middle.zIndex = 2;
        const top = new Drawable({frame: new Rect(20, 20, 40, 30)});
        top.zIndex = 3;
        parent.addChild(middle);
        parent.addChild(top);
        parent.addChild(bottom);
        it('should be sorted by zIndex when a child is added', () => {
            parent.children.should.satisfy((arr) => {
                return (arr[0].zIndex <= arr[1].zIndex && arr[1].zIndex <= arr[2].zIndex);
            });
        });
        it("should be sorted when a child's zIndex is changed", () => {
            bottom.zIndex = 4;
            parent.children[parent.children.length - 1].zIndex.should.eql(4);
        });
    });
    it("should modify its parent's children array when removed from the parent", () => {
        const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
        const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
        parent.addChild(child);
        child.removeFromParent();
        parent.children.length.should.eql(0);
    });
    it("should modify its child's parent property when removing it", () => {
        const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
        const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
        parent.addChild(child);
        parent.removeChild(child);
        should.not.exist(child.parent);
    });
});
