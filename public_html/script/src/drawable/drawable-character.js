/*
    A subclass of DrawableSprite; this incorporates direction (u,r,d,l)
    And changes its frames accordingly. It must be given imageset bounds
    for each of its direction frame sets
*/
'use strict';

import {DrawableSprite} from './drawable-sprite.js';

const [DIRECTION, SUBIMAGE_SIZE, IMAGESET_BOUNDS_LIST]
    = [Symbol('DIRECTION'), Symbol('SUBIMAGE_SIZE'), Symbol('IMAGESET_BOUNDS_LIST')];

export const Direction = {
    get up() { return 0; },
    get right() { return 1; },
    get down() { return 2; }, //default
    get left() { return 3; }
};

export const DrawableCharacter = class extends DrawableSprite {
    constructor({frame, imageSet, subImageWidth, subImageHeight, frameDuration, imagesetBoundsList}) {
        super({
            frame: frame, imageSet: imageSet, subImageWidth: subImageWidth,
            subImageHeight: subImageHeight, frameDuration: frameDuration,
            imageSetBounds: imagesetBoundsList[Direction.down]});
        //imageSetBoundsArr should have the frameset bounds as an array in the order u, r, d, l
        this[DIRECTION] = Direction.down;
        this[SUBIMAGE_SIZE] = {width: subImageWidth, height: subImageHeight};
        this[IMAGESET_BOUNDS_LIST] = imagesetBoundsList;
    }

    set direction(dir) {
        if (dir < 0 || dir > 3) {
            throw new TypeError(
                'DrawableCharacter.direction is being set to a non-Direction value',
                'drawable-character.js');
        }
        this[DIRECTION] = dir;
        this.shouldRedraw = true;
        this.setupSubImageBounds(this[IMAGESET_BOUNDS_LIST][dir], this[SUBIMAGE_SIZE].width, this[SUBIMAGE_SIZE].height);
    }

    get direction() { return this[DIRECTION]; }
};

export default {Direction, DrawableCharacter};
