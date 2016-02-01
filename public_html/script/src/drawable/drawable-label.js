/*
    This is a subclass of drawable with a text property.
    It will draw its text according to its alignment properties
    when draw() is called on it.
*/
'use strict';

import {Drawable} from 'drawable.js';
import draw from '../draw.js';
import {linesFromString, Point} from '../util.js';

const [TEXT, LINES] = [Symbol('TEXT'), Symbol('LINES')];

const [LEFT, RIGHT, CENTER, JUSTIFIED] =
    [Symbol('left'), Symbol('right'), Symbol('center'), Symbol('justified')];

export const TextAlign = {
    get left() { return LEFT; }, // Default
    get right() { return RIGHT; },
    get center() { return CENTER; },
    get justified() { return JUSTIFIED; },
};

const [TOP, MIDDLE, BOTTOM] =
    [Symbol('top'), Symbol('middle'), Symbol('bottom')];

export const VerticalAlign = {
    get top() { return TOP; },
    get middle() { return MIDDLE; }, // Default
    get bottom() { return BOTTOM; },
};

export const DrawableLabel = class extends Drawable {
    constructor({frame, txt}) {
        super({frame: frame});
        this.font = {family: 'sans-serif', size: 16, textAlign: TextAlign.left, verticalAlign: VerticalAlign.middle, baseline: 'middle', reset: false};
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

    setFont({family, size, textAlign, verticalAlign, baseline}) {
        this.font.family = family;
        this.font.size = size;
        this.font.textAlign = textAlign;
        this.font.verticalAlign = verticalAlign,
        this.font.baseline = baseline;
    }

    textStartFromAligns() {
        const [fontArgs, pos] = [{}, new Point(0, 0)];
        switch (this.font.textAlign) {
            case TextAlign.left:
                fontArgs.align = 'left';
                pos.x = this.frame.x;
                break;
            case TextAlign.right:
                fontArgs.align = 'right';
                pos.x = this.frame.x + this.frame.width;
                break;
            case TextAlign.center:
                fontArgs.align = 'center';
                pos.x = (this.frame.x + this.frame.width) / 2;
                break;
            case TextAlign.justified:
                console.log("Justified text not currently supported");
                break;
        }

        switch (this.font.verticalAlign) {
            case VerticalAlign.top:
                fontArgs.baseline = 'top';
                pos.y = this.frame.y;
                break;
            case VerticalAlign.middle:
                fontArgs.baseline = 'middle';
                const centerY = (this.frame.y + this.frame.height) / 2;
                const vertOffset = this[LINES].length * (this.font.size + this.linePadding) / 2;
                pos.y = centerY - vertOffset;
                break;
            case VerticalAlign.bottom:
                fontArgs.baseline = 'bottom';
                pos.y = this.frame.y + this.frame.height - this[LINES].length * (this.font.size + this.linePadding);
                break;
        }
        draw.setFont(fontArgs);
        return pos;
    }

    draw(xOffset = 0, yOffset = 0, shouldDrawChildren = true) {
        super.draw(xOffset, yOffset, false);
        if (this.shouldRedraw) {
            draw.setFont(this.font);
            const textPos = this.textStartFromAligns();
            for (let line of this[LINES]) {
                draw.text(line, ...textPos);
                textPos.y += this.font.size + this.linePadding;
            }
        }
    }
};

export default DrawableLabel;
