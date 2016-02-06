/*
    This is a subclass of DrawableImage with a set of image frames.
    It will cycle through its frames to simulate movement.
*/
'use strict';

import {Drawable} from './drawable';
import draw from '../draw';
import {Rect} from '../graphical-util';

const   [SUBIMAGE_INDEX, SUBIMAGE_BOUNDS, IMAGE_SET] =
        [Symbol('SUBIMAGE_INDEX'), Symbol('SUBIMAGE_BOUNDS'), Symbol('IMAGE_SET')];

export const DrawableSprite = class extends Drawable {
    constructor({frame, imageSet, subImageWidth, subImageHeight, frameDuration, imageSetBounds}) {
        //should be passed a larger image containing each frame
        super({frame: frame});
        if (imageSet === undefined || !(imageSet instanceof Image)) {
            throw new TypeError(
                'DrawableSprite is being passed a non-Image object in its constructor',
                'drawable-sprite.js');
        }
        this[IMAGE_SET] = imageSet;
        this[SUBIMAGE_INDEX] = 0;
        this.frameDuration = frameDuration || 5; //TODO find a good default value
        const imageRect = imageSetBounds || new Rect(0, 0, imageSet.width, imageSet.height);
        this.setupSubImageBounds(imageRect, subImageWidth, subImageHeight);
    }

    setupSubImageBounds(imageRect, subImageWidth, subImageHeight) {
        this[SUBIMAGE_BOUNDS] = [];
        for (let i = imageRect.x; i <= imageRect.width + imageRect.x - subImageWidth; i += subImageWidth) {
            for (let j = imageRect.y; j <= imageRect.height + imageRect.y - subImageHeight; j += subImageHeight) {
                this[SUBIMAGE_BOUNDS].push(new Rect(i, j, subImageWidth, subImageHeight));
            }
        }
    }

    get subImageBounds() { return this[SUBIMAGE_BOUNDS]; }

    draw(xOffset = 0, yOffset = 0) {
        super.draw(xOffset, yOffset);
        if (this.shouldRedraw) {
            draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                draw.image(
                    this[IMAGE_SET],
                    ...this[SUBIMAGE_BOUNDS][Math.floor(this[SUBIMAGE_INDEX] / this.frameDuration)],
                    ...this.frame);
            });
        }
        this[SUBIMAGE_INDEX] = (this[SUBIMAGE_INDEX] + 1) % (this[SUBIMAGE_BOUNDS].length * this.frameDuration);
        this.shouldRedraw = (this[SUBIMAGE_INDEX] % this.frameDuration === 0);
    }
};

export default DrawableSprite;
