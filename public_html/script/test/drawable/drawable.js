'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';
import {spy, stub} from 'sinon';


import {Rect, Point} from '../../src/graphical-util';
import Drawable from '../../src/drawable/drawable';
import RootDrawable from '../../src/drawable/root-drawable';
import draw from '../../src/draw';

describe('drawable.js', () => {

    let fns = {
            image: stub(draw, 'image')
        };
    const root = new RootDrawable({frame: new Rect(20, 20, 400, 300), canvasID: 'game'});
    const drawable = new Drawable({frame: new Rect(20, 20, 400, 300)});
    root.addChild(drawable);

    after(() => {
        fns.image.restore();
    });

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
            parent.children[parent.children.length - 1].zIndex.should.equal(4);
        });
    });
    describe('draw', () => {
        it('should call draw on children with correct offset', () => {
            let fn = spy(drawable.draw);
            root.draw(1, 2);
            setTimeout(() => {
                fn.should.have.been.calledWith(21, 22);
            }, 0);
        });
    });
    describe('animateToPoint', () => {
        it('should move the drawable correctly in a draw() call', () => {
            const pt = drawable.frame.origin;
            drawable.animateToPoint({pt: new Point(360, 450)});
            drawable.frame.origin.should.deep.equal(pt);
            root.draw();
            setTimeout(() => {
                drawable.frame.origin.should.not.deep.equal(pt);
                drawable.frame.origin = new Point(0, 0);
                drawable.animateToPoint({pt: new Point(50, -120), speed: 13});
                for (let i = 0; i < 5; i++) {
                    root.draw();
                }
                drawable.frame.origin.should.deep.equal(new Point(25, -60));
            }, 0);
        });
        it("should detect end of animation and correctly handle it", () => {
            const x = spy();
            drawable.frame.origin = new Point(0, 0);
            drawable.animateToPoint({pt: new Point(-1, 1), speed: 4, completion: x});
            setTimeout(() => {
                root.draw();
                drawable.frame.origin.should.deep.equal(new Point(-1, 1));
                x.should.have.been.calledOnce;
            }, 0);
        });
    });
    describe('addChild', () => {
        it("should call removeFromParent on the child passing itself", () => {
            const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
            const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
            let fn = spy(child, 'removeFromParent');
            parent.addChild(child);
            fn.should.have.been.calledWith(parent);
        });
    });
    /*describe('removeChild', () => {
        it("should call removeFromParent on the child passing nothing", () => {
            const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
            const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
            let fn = spy(child, 'removeFromParent');
            parent.removeChild(child);
            fn.should.have.been.called;
            fn.args.length.should.equal(0);
        });
    });*/
    it("should modify its parent's children array when removed from the parent", () => {
        const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
        const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
        parent.addChild(child);
        child.removeFromParent();
        parent.children.length.should.equal(0);
    });
    it("should modify its child's parent property when removing it", () => {
        const parent = new Drawable({frame: new Rect(20, 20, 400, 300)});
        const child = new Drawable({frame: new Rect(20, 20, 40, 30)});
        parent.addChild(child);
        parent.removeChild(child);
        should.not.exist(child.parent);
    });
});
