/*
    A drawable to be used as the root drawable (directly on the canvas)
*/
'use strict';

import {Drawable} from './drawable';
import {setCanvas} from '../canvas';
import {GridManager} from '../grid/grid-manager';

const [CANVAS_ID, GRID_MANAGER] = [Symbol('CANVAS_ID'), Symbol('GRID_MANAGER')];

export const RootDrawable = class extends Drawable {
    constructor({frame, canvasID}) {
        super({frame: frame});
        this[CANVAS_ID] = canvasID;
    }

    set canvasID(canvasID) {
        this[CANVAS_ID] = canvasID;
    }

    set gridManager(gm) {
        if (!(gm instanceof GridManager)) {
            throw new TypeError(
                'RootDrawable.gridManager is being set to a non-GridManager object',
                'root-drawable.js'
            );
        }
        this[GRID_MANAGER] = gm;
    }

    get gridManager() { return this[GRID_MANAGER]; }

    get canvasID() { return this[CANVAS_ID]; }

    get rootDrawable() { return this; }

    removeFromParent() {
        throw new Error(
            'Trying to assign / remove a parent from a root drawable',
            'root-drawable.js'
        );
    }

    draw(xOffset = 0, yOffset = 0) {
        if (this.canvasID === undefined) {
            throw new Error(
                'Trying to draw from a RootDrawable without a canvasID',
                'root-drawable.js'
            );
        }
        if (setCanvas(this.canvasID)) {
            super.draw(xOffset, yOffset);
        }
        else {
            throw new Error(
                'Trying to draw on a canvas that doesn\'t exist (invalid canvasID)',
                'root-drawable.js'
            );
        }
    }
};

export default RootDrawable;
