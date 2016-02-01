/*
    Various structures to make things easier
*/
'use strict';

import {textWidth, setFont} from './draw.js';

// A sequence of values, which loops around on itself as you iterate over it
const [INNER, ELEMENTS, INDEX] = [Symbol('INNER'), Symbol('ELEMENTS'), Symbol('INDEX')];
const InnerSequence = class {
    constructor(...elements) {
        this[ELEMENTS] = elements;
        this[INDEX] = 0;
    }

    get length() { return this[ELEMENTS].length; }

    get current() { return this[ELEMENTS][this[INDEX]]; }

    get index() { return this[INDEX]; }
    set index(x) {
        return (this[INDEX] = x % this[ELEMENTS].length);
    }

    *[Symbol.iterator]() {
        yield* this[ELEMENTS];
    }

    infinite() {
        const that = this;
        return function*() {
            while(true) yield that.next().value;
        }();
    }

    next() {
        return {done: false, value: this[ELEMENTS][this.index++]};
    }
};
export const Sequence = window.Proxy !== undefined ? new Proxy(class {}, {
    construct(target, args) {
        return new Proxy(new InnerSequence(...args), {
            get(target, prop) {
                return typeof prop !== 'symbol' && !isNaN(prop) ?
                    target[ELEMENTS][(target.length + prop % target.length) % target.length] :
                    target[prop];
            },
            set(target, prop, value) {
                if(typeof prop !== 'symbol' && !isNaN(prop)) {
                    target[ELEMENTS][(target.length + prop % target.length) % target.length] = value;
                    return true;
                } else {
                    target[prop] = value;
                    return true;
                }
            }
        });
    }
}) : InnerSequence;

// A range of values (similar to Python)
const [MIN, MAX, STEP] = [Symbol('MIN'), Symbol('MAX'), Symbol('STEP')];
const InternalRange = class {
    constructor(min, max, step = 1) {
        this[MIN] = min;
        this[MAX] = max;
        this[STEP] = step;
    }

    get min() { return this[MIN]; }
    set min(x) { return (this[MIN] = x); }

    get max() { return this[MAX]; }
    set max(x) { return (this[MAX] = x); }

    get step() { return this[STEP]; }
    set step(x) { return (this[STEP] = x); }

    get length() { return Math.ceil((this[MAX] - this[MIN]) / this[STEP]); }

    *[Symbol.iterator]() {
        if(this[STEP] === 0) { throw new TypeError('Cannot iterate with 0 step'); }
        for(let i = this[MIN]; i < this[MAX]; i += this[STEP]) {
            yield i;
        }
    }

    constrain(x) {
        if(this[STEP] !== 0) {
            x = this[MIN] + Math.round((x - this[MIN]) / this[STEP]) * this[STEP];
        }
        return Math.min(Math.max(x, this[MIN]), this[MAX]);
    }
};
export const Range = window.Proxy !== undefined ? new Proxy(class {}, {
    construct(target, args) {
        return new Proxy(new InternalRange(...args), {
            has(target, x) {
                return x >= target.min && x < target.max && (target.step === 0 || (x - target.min) % target.step === 0);
            }
        });
    }
}) : InternalRange;

// Function produces a range in array form
export const range = (...args) => new Range(...args);

// Pads str with char until its length is len
export const pad = (str, len = 0, char = '') => {
    if(char === '') { throw new TypeError('Cannot pad with no character'); }
    return (str.length >= len) ? str : pad(char + str, len, char);
};

/****************************************   graphic utils   ******************************************/

export const Point = class { //a basic (x, y) coordinate
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    [Symbol.iterator]() { return [this.x, this.y]; }
};

export const Rect = class { //graphical rect - origin is top left
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    [Symbol.iterator]() { return [this.x, this.y, this.width, this.height]; }
    noPoint() {
        return new Rect(0, 0, this.width, this.height);
    }
};

export function aspectFitRect(outsideRect, widthToHeightRatio) {
    const returnFrame = new Rect();
    if (outsideRect.width / outsideRect.height > widthToHeightRatio) {
        //returned frame will have the same height as outsideRect
        returnFrame.height = outsideRect.height;
        returnFrame.width = returnFrame.height * widthToHeightRatio;
        returnFrame.x = outsideRect.x + outsideRect.width / 2 - returnFrame.width / 2;
        returnFrame.y = outsideRect.y;
    } else {
        //returned frame will have the same width as outsideRect
        returnFrame.width = outsideRect.width;
        returnFrame.height = returnFrame.width / widthToHeightRatio;
        returnFrame.y = outsideRect.y + outsideRect.height / 2 - returnFrame.height / 2;
        returnFrame.x = outsideRect.x;
    }
    return returnFrame;
}

export function aspectFillRect(outsideRect, widthToHeightRatio) {
    const returnFrame = new Rect();
    if (outsideRect.width / outsideRect.height > widthToHeightRatio) {
        //returned frame will have the same width as outsideRect
        returnFrame.width = outsideRect.width;
        returnFrame.height = returnFrame.width / widthToHeightRatio;
        returnFrame.y = outsideRect.y + outsideRect.height / 2 - returnFrame.height / 2;
        returnFrame.x = outsideRect.x;
    } else {
        //returned frame will have the same height as outsideRect
        returnFrame.height = outsideRect.height;
        returnFrame.width = returnFrame.height * widthToHeightRatio;
        returnFrame.x = outsideRect.x + outsideRect.width / 2 - returnFrame.width / 2;
        returnFrame.y = outsideRect.y;
    }
    return returnFrame;
}

export function linesFromString({string, fontSize, frame}) {
    setFont({size: fontSize});
    const lines = [];
    let spaceIndex, currentLine = "", previousIndex = -1;
    while ((spaceIndex = string.indexOf(" ", previousIndex + 1)) !== -1) {
        const word = string.substring(previousIndex + 1, spaceIndex);
        const [clWidth, wordWidth] = [textWidth(currentLine), textWidth(word)];
        if (clWidth + wordWidth > frame.width) {
            lines.push(currentLine);
            currentLine = word;
            if (wordWidth > frame.width) {
                lines.push(currentLine.substr(0, Math.round(frame.width / wordWidth)));
                currentLine = "";
            }
        }
        previousIndex = spaceIndex;
    }
    return lines;
}

export default {Sequence, Range, range, pad, Point, Rect};
