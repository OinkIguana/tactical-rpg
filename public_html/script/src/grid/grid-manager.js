/*
    GridManager manages the grids added to a canvas. Add a GridManager to
    a RootDrawable and then add grids to it.
*/
'use strict';

import Grid from './grid';

const [GRIDS, CANVAS_ID] = [Symbol('GRID'), Symbol('CANVAS_ID')];

export const GridManager = class {
    constructor(canvasID) {
        this[CANVAS_ID] = canvasID;
        this[GRIDS] = [];
    }

    get canvasID() { return this[CANVAS_ID]; }

    addGrid(grid) {
        if (!(grid instanceof Grid)) {
            throw new TypeError(
                'Trying to add a non-grid object to a grid manager',
                'grid-manager.js'
            );
        }
        const index = this[GRIDS].indexOf(grid);
        if (index !== -1) {
            throw new Error(
                'Trying to add a grid to a grid manager it\'s already in',
                'grid-manager.js'
            );
        }
        this[GRIDS].push(grid);
    }

    removeGrid(grid) {
        if (!(grid instanceof Grid)) {
            throw new TypeError(
                'Trying to remove a non-grid object from a grid manager',
                'grid-manager.js'
            );
        }
        let index = this[GRIDS].indexOf(grid);
        if (index === -1) {
            throw new Error(
                'Trying to remove a grid from a grid manager it isn\'t in',
                'grid-manager.js'
            );
        }
        this[GRIDS].splice(index, 1);
    }

    cellForPointAndGrids(pt, grids) {
        if (!grids.isArray) {
            grids = [grids];
        }
        let minDist = 60, curFrame;
        for (let grid of this[GRIDS]) {
            if (grid.frame.containsPoint(pt) && grids.indexOf(grid) >= 0) {
                const obj = grid.frameForPoint(pt, minDist);
                if (obj.dist < minDist) {
                    curFrame = obj.frame;
                    minDist = obj.dist;
                }
            }
        }
        return curFrame;
    }
};

export default GridManager;
