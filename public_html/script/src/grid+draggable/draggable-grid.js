/*
    A draggable subclass made for snapping to grid cells.
*/
'use strict';

import {Draggable} from './draggable';

const [LAST_ORIGIN] = [Symbol('LAST_ORIGIN')];

export const DraggableGrid = class extends Draggable {
    constructor({frame, grids, bgImage, imageFrame}) {
        super({
            frame: frame,
            bgImage: bgImage,
            imageFrame: imageFrame
        });
        if (grids.isArray) {
            this.grids = grids;
        }
        else {
            this.grids = [grids];
        }
        this[LAST_ORIGIN] = frame.origin;
    }

    onMouseUp(e) {
        if (this.isDragging === true && this.parent !== undefined) {
            let gm = this.parent.getRootDrawable().gridManager;
            if (gm === undefined) {
                throw new Error(
                    'DraggableGrid\'s parent doesn\'t have a grid manager',
                    'draggable-grid.js'
                );
            }
            let cellFrame = gm.cellForPointAndGrids(this.frame.center, this.grids);
            this.canDrag = false;
            let dest = this[LAST_ORIGIN];
            if (cellFrame !== undefined) { dest = cellFrame.origin; }
            this.animateToPoint({pt: dest, speed: 4, completion: () => {
                this.canDrag = true;
            }});
            this[LAST_ORIGIN] = dest;
        }
        super.onMouseUp(e);
    }
};

export default DraggableGrid;
