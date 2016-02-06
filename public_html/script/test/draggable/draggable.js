'use strict';

import {should as should_} from 'chai';
const should = should_();

import {spy, stub} from 'sinon';
import $ from 'jquery';

import {Rect, Point} from '../../src/graphical-util';
import Drawable from '../../src/drawable/drawable';
import RootDrawable from '../../src/drawable/root-drawable';
import Draggable from '../../src/draggable/draggable';

describe('draggable.js', () => {
    const draggable = new Draggable({frame: new Rect(20, 40, 50, 50)});
    const root = new RootDrawable({frame: new Rect(0, 0, 300, 45), canvasID: 'game'});
    const fns = {  up: spy(draggable, 'onMouseUp'),
                 down: spy(draggable, 'onMouseDown'),
                 move: spy(draggable, 'onMouseMove'),
             };
    afterEach(() => {
        fns.up.reset();
        fns.down.reset();
        fns.move.reset();
    });
    describe('new Draggable', () => {
        it('should return a valid Draggable', () => {
            draggable.should.be.an.instanceof(Draggable);
        });
    });

    describe('removeFromParent', () => {
        it('should throw if and only if newParent is a defined object that isn\'t a RootDrawable', () => {
            (()=>{draggable.removeFromParent();}).should.not.throw(TypeError);
            (()=>{draggable.removeFromParent(new Drawable());}).should.throw(TypeError);
            let fn = spy(draggable, 'removeFromParent');
            root.addChild(draggable);
            root.removeChild(draggable);
            fn.should.not.have.thrown;
            fn.restore();
            (() => {
                const drawable = new Drawable({frame: new Rect(0, 0, 300, 45)});
                drawable.addChild(draggable);
            }).should.throw(TypeError);
        });
        it('should get a valid canvas', () => {
            root.addChild(draggable);
            should.exist(draggable.jqCanvas);
            root.removeChild(draggable);
        });
        it('should bind mouse event handlers to the canvas it\'s on', () => {
            root.addChild(draggable);
            let jqCanvas = draggable.jqCanvas;/*{
                mousedown: draggable.onMouseDown,
                mouseup: draggable.onMouseUp,
                mousemove: draggable.onMouseMove
            };*/
            jqCanvas.mousedown();
            fns.down.should.have.been.called;
            jqCanvas.mouseup();
            fns.up.should.have.been.called;
            jqCanvas.mousemove();
            fns.move.should.have.been.called;
            root.removeChild(draggable);
        });
    });
    describe('mouse event handlers', () => {
        root.addChild(draggable);
        let origin = draggable.frame.origin;
        it('should not move the draggable when the mouse is up', () => {
            draggable.onMouseMove({pageX: 300, pageY: 20});
            origin.should.deep.equal(draggable.frame.origin);
            draggable.onMouseDown({pageX: draggable.frame.center.x, pageY: draggable.frame.center.y});
            draggable.onMouseUp();
            draggable.onMouseMove({pageX: draggable.frame.center.x + 10, pageY: draggable.frame.center.y});
            origin.should.deep.equal(draggable.frame.origin);
        });
        it('should not move the draggable when the mouse started dragging outside', () => {
            draggable.onMouseDown({pageX: 300, pageY: 200});
            draggable.onMouseMove({pageX: 300, pageY: 210});
            origin.should.deep.equal(draggable.frame.origin);
            draggable.onMouseUp();
        });
        it('should  move the draggable when the mouse started dragging inside', () => {
            draggable.onMouseDown({pageX: draggable.frame.center.x, pageY: draggable.frame.center.y});
            draggable.onMouseMove({pageX: draggable.frame.center.x + 10, pageY: draggable.frame.center.y});
            draggable.frame.origin.should.deep.equal(new Point(origin.x + 10, origin.y));
            draggable.onMouseUp();
        });
    });
});
