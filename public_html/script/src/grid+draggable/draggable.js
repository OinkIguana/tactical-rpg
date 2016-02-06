/*
    Draggable is a screen element with functionality to drag and drop it
    around the screen. It subclasses DrawableImage b/c draggables will
    frequently be images.
    Draggables should always be direct children of the root drawable
*/
'use strict';

import $ from 'jquery';

import DrawableImage from '../drawable/drawable-image';
import RootDrawable from '../drawable/root-drawable';
import {Point} from '../graphical-util';

const [IS_DRAGGING, TOUCH_OFFSET, JQCANVAS, ADD_MH, REM_MH] =
    [Symbol('IS_DRAGGING'), Symbol('JQCANVAS'), Symbol('ADD_MH'),
    Symbol('REM_MH'), Symbol('TOUCH_OFFSET')];

export const Draggable = class extends DrawableImage {

    removeFromParent(newParent) {
        if (newParent !== undefined && !(newParent instanceof RootDrawable)) {
            throw new TypeError(
                'Attempting to add a draggable to a non-RootDrawable',
                'draggable.js'
            );
        } else if (newParent === undefined) {
            this[REM_MH]();
            this[JQCANVAS] = undefined;
        } else if ( (newParent !== undefined && this.parent === undefined) ||
                    (this.parent !== undefined &&
                    this.parent.canvasID !== newParent.canvasID)) {
            this[JQCANVAS] = $(`#${newParent.canvasID}`);
            this[ADD_MH]();
        }
        this.canDrag = true;
        super.removeFromParent(newParent);
    }

    get jqCanvas() { return this[JQCANVAS]; }

    get isDragging() { return this[IS_DRAGGING]; }

    onMouseDown(e) {
        if (this.frame.containsPoint(e.pageX, e.pageY) && this.canDrag) {
            this[IS_DRAGGING] = true;
            this[TOUCH_OFFSET] = new Point(this.frame.center.x - e.pageX, this.frame.center.y - e.pageY);
        }
    }
    onMouseUp(e) {
        this[IS_DRAGGING] = false;
    }
    onMouseMove(e) {
        if (this[IS_DRAGGING] && this.canDrag) {
            this.frame.center = new Point(e.pageX + this[TOUCH_OFFSET].x, e.pageY + this[TOUCH_OFFSET].y);
        }
    }

    [REM_MH]() {
        this.jqCanvas.unbind('mousedown', $.proxy(this.onMouseDown, this));
        this.jqCanvas.unbind('mouseup', $.proxy(this.onMouseUp, this));
        this.jqCanvas.unbind('mousemove', $.proxy(this.onMouseMove, this));
    }

    [ADD_MH]() {
        this.jqCanvas.mousedown($.proxy(this.onMouseDown, this));
        this.jqCanvas.mouseup($.proxy(this.onMouseUp, this));
        this.jqCanvas.mousemove($.proxy(this.onMouseMove, this));
    }
};

export default Draggable;
