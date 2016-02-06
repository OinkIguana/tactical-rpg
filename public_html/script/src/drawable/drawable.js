/*
    The root class for every drawable object.
    It contains some functionality for ui, but most drawables will
    be instances of its subclasses
*/
'use strict';

import {range} from '../util';
import {Rect, Point, dist} from '../graphical-util';
import draw from '../draw';
import {canvas, context, setCanvas} from '../canvas';


const [ CHILDREN, PARENT, BGCOLOR, Z_INDEX, FRAME, MOVEMENT_VECTOR,
        DEST_POINT, ANIM_COMPLETION, ANIM_COMPLETE]
    = [Symbol('CHILDREN'), Symbol('PARENT'),
       Symbol('BGCOLOR'), Symbol('Z_INDEX'),
       Symbol('FRAME'), Symbol('MOVEMENT_VECTOR'),
       Symbol('DEST_POINT'), Symbol('ANIM_COMPLETION'), Symbol('ANIM_COMPLETE')];

export const Drawable = class {
    constructor({frame}) {
        if (frame !== undefined && !(frame instanceof Rect)) {
            //frame can be undefined b/c Drawable should be createable w/o passing a frame
            throw new TypeError("Drawable.frame is being set to a non-Rect object", 'drawable.js');
        }
        this[FRAME] = frame; //frame is a Rect object
        this[CHILDREN] = [];
        this[Z_INDEX] = 0; //Drawables with higher z orders are drawn on top
        this[BGCOLOR] = 'transparent';
        this.shouldRedraw = true; //if the screen is refreshing constanly, no need to redraw static elements
    }

    addChild(child) { //child must inherit from Drawable
        if (!(child instanceof Drawable)) {
            throw new TypeError(
                'Drawable.addChild is being passed an object that doesn\'t inherit from Drawable',
                'drawable.js');
        }
        child.removeFromParent(this);
        child[PARENT] = this;
        this[CHILDREN].push(child);
        this.shouldRedraw = true;
        this.sortChildren();
    }

    removeFromParent(newParent) { //call this BEFORE changing the parent
                                //so the old parent can be accessed by this[PARENT]
                                //if you call this passing a parent you should set
                                //the parent immediately after
        if (this[PARENT] !== undefined) {
             this[PARENT].removeChild(this);
        }
    }

    removeChild(child) {
        if (!(child instanceof Drawable)) {
            throw new TypeError(
                'Drawable.removeChild is being passed an object that doesn\'t inherit from Drawable',
                'drawable.js');
        }
        child[PARENT] = undefined;
        for (let i = 0; i < this[CHILDREN].length; i++) {
            if (this[CHILDREN][i] === child) {
                this[CHILDREN].splice(i, 1);
                break;
            }
        }
        this.sortChildren();
    }

    [ANIM_COMPLETE]() {
        this[ANIM_COMPLETION]();
        this[ANIM_COMPLETION] = undefined;
        this[MOVEMENT_VECTOR] = new Point(0, 0);
    }

    animateToPoint({pt, speed, completion}) { //speed in pixels / frame
        if (speed === undefined) { speed = 4; }
        if (speed === 0) { return; }
        if (completion !== undefined) { this[ANIM_COMPLETION] = completion; }
        let distance = dist(pt, this.frame.origin);
        let dx = speed / distance * (pt.x - this.frame.x);
        let dy = speed / distance * (pt.y - this.frame.y);
        this[DEST_POINT] = pt;
        this[MOVEMENT_VECTOR] = new Point(dx, dy);
    }

    getRootDrawable() { //gets the drawable that's directly on the canvas
                        //throws if the drawable isn't in the view heirarchy
        if (this[PARENT] !== undefined){
            return this[PARENT].getRootDrawable();
        }
        else {
            return undefined;
        }
    }

    get children() { return this[CHILDREN]; }
    get parent() { return this[PARENT]; }

    get backgroundColor() { return this[BGCOLOR]; }
    set backgroundColor({r, g, b, a}) {
        const alpha = isNaN(a) ? 1 : range(0, 1, 0).constrain(a);
        this[BGCOLOR] = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    //a higher zIndex means the drawable will be drawn in front
    get zIndex() {  return this[Z_INDEX]; }
    set zIndex(zIndex) {
        this[Z_INDEX] = zIndex;
        if (this[PARENT] !== undefined) {
            this[PARENT].sortChildren();
        }
    }

    get frame() {
        return this[FRAME];
        /*const that = this;
        if(window.Proxy !== undefined) {
            return new Proxy(this[FRAME], {
                get(target, property) { return target[property]; },
                set(target, property, value) {
                    that.shouldRedraw = true;
                    target[property] = value;
                }
            });
        } else {
            return {
                get x() { return that[FRAME].x; },
                set x(v) {
                    that.shouldRedraw = true;
                    that[FRAME].x = v;
                },
                get y() { return that[FRAME].y; },
                set y(v) {
                    that.shouldRedraw = true;
                    that[FRAME].y = v;
                },
                get width() { return that[FRAME].width; },
                set width(v) {
                    that.shouldRedraw = true;
                    that[FRAME].width = v;
                },
                get height() { return that[FRAME].height; },
                set height(v) {
                    that.shouldRedraw = true;
                    that[FRAME].height = v;
                },
                [Symbol.iterator]() { return that[FRAME][Symbol.iterator](); }
            };
        }*/
    }
    set frame(frame) {
        if (!(frame instanceof Rect)) {
            throw new TypeError("Drawable.frame is being set to a non-Rect object", 'drawable.js');
        }
        this.shouldRedraw = true;
        this[FRAME] = frame;
    }

    sortChildren() { //sorts from back-most child to front-most child
        //(back-most will be drawn first, then front-most will write over it)
        this[CHILDREN].sort((a, b) => a[Z_INDEX] - b[Z_INDEX]);
        this.shouldRedraw = true;
    }

    draw(xOffset = 0, yOffset = 0) { //the function that all drawable subclasses will implement
                             //to draw to the canvas (ie to the screen).
                             //every drawable at the bottom of the inheritance chain
                             //should draw its own content, then call draw()
                             //on each of its children -- drawChildren() -- passing its own x, y as offset params
        if (this[FRAME] === undefined) return;
        if (this.canvasID === undefined && this[PARENT] === undefined) {
            throw new Error(
                'Trying to draw a Drawable that isn\'t in the draw hierarchy (not "on the screen")',
                'drawable.js');
        }
        if (this[MOVEMENT_VECTOR] !== undefined && this[MOVEMENT_VECTOR].x !== 0 && this[MOVEMENT_VECTOR].y !== 0) {
            this.frame.x += this[MOVEMENT_VECTOR].x;
            this.frame.y += this[MOVEMENT_VECTOR].y;
            if (Math.abs(this.frame.x - this[DEST_POINT].x) < //if the point is closer now than it would be next frame
                Math.abs(this.frame.x + this[MOVEMENT_VECTOR].x - this[DEST_POINT].x)) {
                    this.frame.origin = this[DEST_POINT];
                    this[ANIM_COMPLETE]();
                }
        }
        if (this.shouldRedraw) {
            if(this[BGCOLOR] !== 'transparent') {
                draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                    draw.setColor(this[BGCOLOR]);
                    draw.rect(...this[FRAME]);
                });
            }
            this.shouldRedraw = false;
        }
        //this makes sure children are drawn after all of the parent's drawing is complete
        setTimeout(() => this.drawChildren(xOffset, yOffset), 0);
    }

    drawChildren(xOffset, yOffset) {
        for (let child of this[CHILDREN]) {
            child.draw(xOffset + this[FRAME].x, yOffset + this[FRAME].y);
        }
    }
};

export default Drawable;
