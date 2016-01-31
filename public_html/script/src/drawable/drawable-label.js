/*
    This is a subclass of drawable with a text property.
    It will draw its text according to its alignment properties
    when draw() is called on it.
*/
'use strict';

import {Drawable} from 'drawable.js';
import draw from '../draw.js';
import {linesFromString} from '../util.js';

const [TEXT, LINES] = [Symbol('TEXT'), Symbol('LINES')];

export const TextAlign = {
    left: Symbol('left'), //default
    right: Symbol('right'),
    center: Symbol('center'),
    justified: Symbol('justified')
};

export const VerticalAlign = {
    top: Symbol('top'),
    middle: Symbol('middle'), //default
    bottom: Symbol('bottom')
};

export const DrawableLabel = class extends Drawable {
    constructor({frame, txt}) {
        super({frame: frame});
        this.font = {family: 'sans-serif', size: 16, textAlign: TextAlign.left, verticalAlign: VerticalAlign.center, baseline: 'middle', reset: false};
        if (txt !== undefined) {
            if (!(txt instanceof String)) {
                throw new TypeError("DrawableLabel is being passed a non-String object in its constructor", 'drawable-image.js');
            }
            this.text = txt;
        }
        this.linePadding = 3; //space between lines
    }

    set text(txt) {
        if (!(txt instanceof String)) {
            throw new TypeError("DrawableLabel.text is being set to a non-String object", 'drawable-image.js');
        }
        this[TEXT] = txt;
        this[LINES] = linesFromString({string: txt, fontSize: this.font.size, frame: this.frame});
    }

    get text() {
        return this[TEXT];
    }

    set frame(frame) {
        super.frame = frame;
        this[LINES] = linesFromString({string: this.text, fontSize: this.font.size, frame: this.frame});
    }

    get frame() { return super.frame; }

    setFont({family, size, textAlign, verticalAlign, baseline, reset}) {
        this.font.family = family;
        this.font.size = size;
        this.font.textAlign = textAlign;
        this.font.verticalAlign = verticalAlign,
        this.font.baseline = baseline;
        this.font.reset = reset;
    }

    textStartFromAligns() {
        let textX, textY, fontArgs = {};
        switch (this.font.textAlign) {
            case TextAlign.left:
                fontArgs.align = 'left';
                textX = this.frame.x;
                break;
            case TextAlign.right:
                fontArgs.align = 'right';
                textX = this.frame.x + this.frame.width;
                break;
            case TextAlign.center:
                fontArgs.align = 'center';
                textX = (this.frame.x + this.frame.width) / 2;
                break;
            case TextAlign.justified:
                console.log("Justified text not currently supported");
                break;
        }

        switch (this.font.verticalAlign) {
            case VerticalAlign.top:
                fontArgs.baseline = 'top';
                textY = this.frame.y;
                break;
            case VerticalAlign.middle:
                fontArgs.baseline = 'middle';
                let centerY = (this.frame.y + this.frame.height) / 2;
                let vertOffset = this[LINES].length * (this.font.size + this.linePadding) / 2;
                textY = centerY - vertOffset;
                break;
            case VerticalAlign.bottom:
                fontArgs.baseline = 'bottom';
                textY = this.frame.y + this.frame.height - this[LINES].length * (this.font.size + this.linePadding);
                break;
        }
        draw.setFont(fontArgs);
        return {textX: textX, textY: textY};
    }

    draw(xOffset = 0, yOffset = 0, shouldDrawChildren = true) {
        super.draw(xOffset, yOffset, false);
        if (this.shouldRedraw) {
            draw.setFont(this.font);
            let textPos = this.textStartFromAligns();
            for (let line of this[LINES]) {
                draw.text(line, textPos.textX, textPos.textY);
                textPos.textY += this.font.size + this.linePadding;
            }
        }
    }
};

export default DrawableLabel;
