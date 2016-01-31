/*
    A subclass of DrawableSprite; this incorporates direction (u,d,l,r)
    And changes its frames accordingly. It must be given imageset bounds
    for each of its direction frame sets
*/
'use strict';

import {DrawableSprite} from './drawable-sprite.js';

const [DIRECTION, SUBIMAGE_SIZE, IMAGESET_BOUNDS_LIST]
    = [Symbol('DIRECTION'), Symbol('SUBIMAGE_SIZE'), Symbol('IMAGESET_BOUNDS_LIST')];

export const Direction = {
    up: 0,
    down: 1, //default
    left: 2,
    right: 3
};

export const DrawableCharacter = class extends DrawableSprite {
    constructor({frame, imageSet, subImageWidth, subImageHeight, cyclesPerFrame, imagesetBoundsList}) {
        super({frame: frame, imageSet: imageSet, subImageWidth: subImageWidth,
            subImageHeight: subImageHeight, cyclesPerFrame: cyclesPerFrame, imageSetBounds: imagesetBoundsList[Direction.down]});
        this[DIRECTION] = Direction.down; //imageSetBoundsArr should have the frameset bounds as an array in the order u, d, l, r
        this[SUBIMAGE_SIZE] = {width: subImageWidth, height: subImageHeight};
        this[IMAGESET_BOUNDS_LIST] = imagesetBoundsList;    
    }

    set direction(dir) {
        if (dir < 0 || dir > 3) {
            throw new TypeError("DrawableCharacter.direction is being set to a non-Direction value", 'drawable-character.js');
        }
        this[DIRECTION] = dir;
        this.shouldRedraw = true;
        this.setupSubImageBounds(this[IMAGESET_BOUNDS_LIST][dir], this[SUBIMAGE_SIZE].width, this[SUBIMAGE_SIZE].height);
    }

    get direction() { return this[DIRECTION]; }
};

export default {Direction, DrawableCharacter};
