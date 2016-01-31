/*
    This is a subclass of drawable with a backgroundImage property.
    It will draw the backgroundImage according to its imageFill property
    when draw() is called on it.
*/
'use strict';

import {Drawable} from 'drawable.js';
import draw from '../draw.js';
import {aspectFillRect, aspectFitRect} from '../util.js';

const [BGIMAGE, IMG_FRAME, SCALE_MODE] = [Symbol('BGIMAGE'), Symbol('IMG_FRAME'), Symbol('SCALE_MODE')];

export const ScaleMode = {
    toFill: Symbol('toFill'),
    aspectToFill: Symbol('aspectToFill'),
    aspectToFit: Symbol('aspectToFit') //default
};

export const DrawableImage = class extends Drawable {
    constructor({frame, bgImage, imageFrame}) {
        //imageFrame is the frame of the subimage in the given image
        super({frame: frame});
        if (bgImage !== undefined) {
            if (!(bgImage instanceof Image)) {
                throw new TypeError("DrawableImage is being passed a non-Image object in its constructor", 'drawable-image.js');
            }
            this[BGIMAGE] = bgImage;
        }
        if (imageFrame !== undefined) {
            this[IMG_FRAME] = imageFrame;
            this[SCALE_MODE] = ScaleMode.toFill; //if the image is given as a subimage, scaleMode must be toFill
                                            //(cause I really don't wanna figure out the math otherwise)
        }
        else {
            this[SCALE_MODE] = ScaleMode.aspectToFit;
        }
    }

    set backgroundImage(bgImage) {
        if (!(bgImage instanceof Image)) {
            throw new TypeError("DrawableImage.backgroundImage is being set to a non-Image value", 'drawable-image.js');
        }
        this[BGIMAGE] = bgImage;
        this.shouldRedraw = true;
    }

    get backgroundImage() { return this[BGIMAGE]; }

    set scaleMode(mode) {
        if (this[IMG_FRAME] === undefined) {
            this[SCALE_MODE] = mode;
        }
        else {
            console.log("scaleMode cannot be changed when the image is set as a subimage");
        }
    }

    get scaleMode() { return this[SCALE_MODE]; }


    draw(xOffset = 0, yOffset = 0, shouldDrawChildren = true) {
        super.draw(xOffset, yOffset, false);
        if (this.backgroundImage !== undefined && this.shouldRedraw) {
            switch (this.scaleMode) {
                case ScaleMode.toFill:
                    if (this[IMG_FRAME] !== undefined) {
                        draw.image({img: this.backgroundImage, x: this.frame.x + xOffset, y: this.frame.y + yOffset,
                                    sx: this[IMG_FRAME].x, sy: this[IMG_FRAME].y,
                                    swidth: this[IMG_FRAME].width, sheight: this[IMG_FRAME].height,
                                    width: this.frame.width, height: this.frame.height});
                    }
                    else {
                        draw.image({img: this.backgroundImage, x: this.frame.x + xOffset, y: this.frame.y + yOffset,
                                    width: this.frame.width, height: this.frame.height});
                    }
                    break;
                case ScaleMode.aspectToFill:
                    let imgRect = aspectFillRect(this.frame, this.backgroundImage.width / this.backgroundImage.height);
                    draw.image({img: this.backgroundImage, x: imgRect.x, y: imgRect.y,
                                sx: this.frame.x, sy: this.frame.y,
                                swidth: this.frame.width, sheight: this.frame.height,
                                width: imgRect.width, height: this.frame.height});
                    break;
                case ScaleMode.aspectToFit:
                    let imgRect = aspectFitRect(this.frame, this.backgroundImage.width / this.backgroundImage.height);
                    draw.image({img: this.backgroundImage, x: imgRect.x, y: imgRect.y,
                                width: imgRect.width, height: this.frame.height});
                    break;
                default:
                    throw new Error("DrawableImage.scaleMode is undefined while drawing", 'drawable-image.js');
            }
        }
    }
};

export default DrawableImage;
