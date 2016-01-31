/*
    The root class for every drawable object.
    It contains some functionality for ui, but most drawables will
    be instances of its subclasses
*/
'use strict';

import {Rect, Color} from '../util.js';
import draw from '../draw.js';
import {canvas, context, setCanvas} from '../canvas.js';


const [CHILDREN, PARENT, BGCOLOR, Z_INDEX, CANVAS_ID, FRAME]
    = [Symbol('CHILDREN'), Symbol('PARENT'),
       Symbol('BGCOLOR'), Symbol('Z_INDEX'), Symbol('CANVAS_ID'),
       Symbol('FRAME')];

export const Drawable = class {
    constructor({frame}) {
        if (frame !== undefined && !(frame instanceof Rect)) {
            //frame can be undefined b/c Drawable should be createable w/o passing a frame
            throw new TypeError("Drawable.frame is being set to a non-Rect object", 'drawable.js');
        }
        this[FRAME] = frame; //frame is a Rect object
        this[CHILDREN] = [];
        this[Z_INDEX] = 0; //Drawables with higher z orders are drawn on top
        this.shouldRedraw = true; //if the screen is refreshing constanly, no need to redraw static elements
    }

    addChild(childP) { //child must inherit from Drawable
        if (!(childP instanceof Drawable)) {
            throw new TypeError("Drawable.addChild is being passed an object that doesn't inherit from Drawable", 'drawable.js');
        }
        childP[PARENT] = this;
        this[CHILDREN].push(childP);
        this.shouldRedraw = true;
        this.sortChildren();
    }

    removeChild(childP) {
        if (!(childP instanceof Drawable)) {
            throw new TypeError("Drawable.removeChild is being passed an object that doesn't inherit from Drawable", 'drawable.js');
        }
        childP[PARENT] = undefined;
        for (let i = 0; i < this[CHILDREN].length; i++) {
            if (this[CHILDREN][i] === childP) {
                this[CHILDREN].splice(i, 1);
                break;
            }
        }
        this.sortChildren();
    }

    removeFromParent() {
        if (this[PARENT] !== undefined) {
            for (let i = 0; i < this[PARENT].children.length; i++) {
                if (this[PARENT].children[i] === this) {
                    this[PARENT].children.splice(i, 1);
                    break;
                }
            }
            this[PARENT].sortChildren();
        }
    }

    addToCanvas(canvasID) {
        this[CANVAS_ID] = canvasID;
        //this.draw(); TODO do we need this or should we keep it out?
    }

    get canvasID() {
        return this[CANVAS_ID];
    }

    get children() { return this[CHILDREN]; }
    get parent() { return this[PARENT]; }

    get backgroundColor() { return this[BGCOLOR]; }
    set backgroundColor({r, g, b, a}) {
        const alpha = a || 1;
        this[BGCOLOR] = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    get zIndex() {  return this[Z_INDEX]; } //a higher zIndex means the drawable will be drawn in front
    set zIndex(zIndexP) {
        this[Z_INDEX] = zIndexP;
        if (this[PARENT] !== undefined) {
            this[PARENT].sortChildren();
        }
    }

    get frame() {
        this.shouldRedraw = true;
        return this[FRAME];
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
        this[CHILDREN].sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
        this.shouldRedraw = true;
    }

    draw(xOffset = 0, yOffset = 0) { //the function that all drawable subclasses will implement
                             //to draw to the canvas (ie to the screen).
                             //every drawable at the bottom of the inheritance chain
                             //should draw its own content, then call draw()
                             //on each of its children -- drawChildren() -- passing its own x, y as offset params
        if (this.frame === undefined) return;
        if (this.canvasID === undefined && this[PARENT] === undefined) {
            throw new Error("Trying to draw a Drawable that isn't in the draw hierarchy (not 'on the screen')", 'drawable.js');
        }
        else if (this.canvasID !== undefined) {
            setCanvas(this.canvasID);
        }
        if (this.shouldRedraw) {
            draw.setColor(this.backgroundColor);
            draw.rect(xOffset + this.frame.x, yOffset + this.frame.y, this.frame.width, this.frame.height);
            this.shouldRedraw = false;
        }
        setTimeout(() => { //this makes sure children are drawn after all of the parent's drawing is complete
            this.drawChildren(xOffset, yOffset);
        }, 0);
    }

    drawChildren(xOffset, yOffset) {
        for (let child of this.children) {
            child.draw(xOffset + this.frame.x, yOffset + this.frame.y, true);
        }
    }
};

export default Drawable;
