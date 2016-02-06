/*
    This is a subclass of drawable with a backgroundImage property.
    It will draw the backgroundImage according to its imageFill property
    when draw() is called on it.
*/
'use strict';

import {Drawable} from './drawable';
import draw from '../draw';
import {aspectFillRect, aspectFitRect} from '../graphical-util';

const [BGIMAGE, IMG_FRAME, SCALE_MODE] =
        [Symbol('BGIMAGE'), Symbol('IMG_FRAME'), Symbol('SCALE_MODE')];

const [TO_FILL, ASPECT_TO_FILL, ASPECT_TO_FIT] =
        [Symbol('toFill'), Symbol('aspectToFill'), Symbol('aspectToFit')];

export const ScaleMode = {
    get toFill() { return TO_FILL; },
    get aspectToFill() { return ASPECT_TO_FILL; },
    get aspectToFit() { return ASPECT_TO_FIT; } //default
};

export const DrawableImage = class extends Drawable {
    constructor({frame, bgImage, imageFrame}) {
        //imageFrame is the frame of the subimage in the given image
        super({frame: frame});
        if (bgImage !== undefined) {
            if (!(bgImage instanceof Image)) {
                throw new TypeError(
                    'DrawableImage is being passed a non-Image object in its constructor',
                    'drawable-image.js');
            }
            this[BGIMAGE] = bgImage;
        }
        if (imageFrame !== undefined) {
            this[IMG_FRAME] = imageFrame;
            this[SCALE_MODE] = ScaleMode.toFill; //if the image is given as a subimage, scaleMode must be toFill
                                            //(cause I really don't wanna figure out the math otherwise)
        } else {
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
        } else {
            console.log('scaleMode cannot be changed when the image is set as a subimage');
        }
    }

    get scaleMode() { return this[SCALE_MODE]; }

    draw(xOffset = 0, yOffset = 0) {
        super.draw(xOffset, yOffset);
        if (this[BGIMAGE] !== undefined) {
            let imgRect;
            switch (this[SCALE_MODE]) {
                case ScaleMode.toFill:
                    if (this[IMG_FRAME] !== undefined) {
                        draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                            draw.image(this[BGIMAGE], ...this[IMG_FRAME], ...this.frame);
                        });
                    } else {
                        draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                            draw.image(this[BGIMAGE], ...this.frame);
                        });
                    }
                    break;
                case ScaleMode.aspectToFill:
                    imgRect = aspectFillRect(...this.frame.noPoint(), this[BGIMAGE].width / this[BGIMAGE].height);
                    draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                        new draw.Path()
                            .rect(...this.frame)
                            .doInside(() => {
                                draw.image(this[BGIMAGE], ...imgRect);
                            });
                    });
                    // let imgRect = aspectFillRect(this.frame, this[BGIMAGE].width / this[BGIMAGE].height);
                    // draw.image({img: this[BGIMAGE], x: imgRect.x, y: imgRect.y,
                    //             sx: this.frame.x, sy: this.frame.y,
                    //             swidth: this.frame.width, sheight: this.frame.height,
                    //             width: imgRect.width, height: this.frame.height});
                    break;
                case ScaleMode.aspectToFit:
                    imgRect = aspectFitRect(...this.frame, this[BGIMAGE].width / this[BGIMAGE].height);
                    draw.transformed({translate: {x: xOffset, y: yOffset}}, () => {
                        draw.image(this[BGIMAGE], ...imgRect);
                    });
                    // let imgRect = aspectFitRect(this.frame, this[BGIMAGE].width / this[BGIMAGE].height);
                    // draw.image({img: this[BGIMAGE], x: imgRect.x, y: imgRect.y,
                    //             width: imgRect.width, height: this.frame.height});
                    break;
                default:
                    throw new Error('DrawableImage.scaleMode is undefined while drawing', 'drawable-image.js');
            }
        }
    }
};

export default DrawableImage;
