/*
    This is a subclass of DrawableImage with a set of image frames.
    It will cycle through its frames to simulate movement.
*/
'use strict';

import {Drawable} from './drawable.js';
import draw from '../draw.js';
import {Rect} from '../util.js';

const [CYCLE_COUNT, SUBIMAGE_BOUNDS, IMAGE_SET] = [Symbol('CYCLE_COUNT'), Symbol('SUBIMAGE_BOUNDS'), Symbol('IMAGE_SET')];

export const DrawableSprite = class extends Drawable {
    constructor({frame, imageSet, subImageWidth, subImageHeight, cyclesPerFrame, imageSetBounds}) { //should be passed a larger image containing each frame
        super({frame: frame});
        if (imageSet === undefined || !(imageSet instanceof Image)) {
            throw new TypeError("DrawableSprite is being passed a non-Image object in its constructor", 'drawable-sprite.js');
        }
        this[IMAGE_SET] = imageSet;
        this[CYCLE_COUNT] = 0;
        this.cyclesPerFrame = cyclesPerFrame || 5; //TODO find a good default value
        let imgRect = imageSetBounds || new Rect(0, 0, imageSet.width, imageSet.height);
        this.setupSubImageBounds(imgRect, subImageWidth, subImageHeight);
    }

    setupSubImageBounds(imageSetBounds, subImageWidth, subImageHeight) {
        this[SUBIMAGE_BOUNDS] = [];
        for (let i = imageSetBounds.x; i <= imageSetBounds.width + imageSetBounds.x - subImageWidth; i += subImageWidth) {
            for (let j = imageSetBounds.y; j <= imageSetBounds.height + imageSetBounds.y - subImageHeight; j += subImageHeight) {
                this[SUBIMAGE_BOUNDS].push(new Rect(i, j, subImageWidth, subImageHeight));
            }
        }
    }

    get subImageBounds() { return this[SUBIMAGE_BOUNDS]; }

    draw(xOffset = 0, yOffset = 0, shouldDrawChildren = true) {
        super.draw(xOffset, yOffset, false);
        if (this.shouldRedraw) {
            draw.sprite(this[IMAGE_SET], this[SUBIMAGE_BOUNDS][this[CYCLE_COUNT] / this.cyclesPerFrame],
                this.frame.x + xOffset, this.frame.y + yOffset);
        }
        if (this[CYCLE_COUNT] / this.cyclesPerFrame !=  ++this[CYCLE_COUNT] / this.cyclesPerFrame) {
            if (this[CYCLE_COUNT] === this.cyclesPerFrame * this[SUBIMAGE_BOUNDS].length) {
                this[CYCLE_COUNT] = 0;
            }
            this.shouldRedraw = true;
        }
    }
};

export default DrawableSprite;
