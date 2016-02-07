/*
    Util functions / classes for visual / graphic purposes
*/
'use strict';

import {textWidth, setFont} from './draw.js';

export const Point = class { //a basic (x, y) coordinate
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distTo(...args) {
        let pt = args[0];
        if (args.length === 2) {
            pt = new Point(args[0], args[1]);
        }
        return dist(this, pt);
    }

    *[Symbol.iterator]() { yield* [this.x, this.y]; }
};

export const Size = class {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    *[Symbol.iterator]() { yield* [this.width, this.height]; }
};

export const Rect = class { //graphical rect - origin is top left
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    set right(r) {
        const dx = r - this.right;
        this.x += dx;
    }

    get right() { return this.x + this.width; }

    set bottom(b) {
        const dy = b - this.bottom;
        this.y += dy;
    }

    get bottom() { return this.y + this.height; }

    set center(...args) {
        let pt = args[0];
        if (args.length === 2) {
            pt = new Point(args[0], args[1]);
        }
        this.x = pt.x - this.width / 2;
        this.y = pt.y - this.height / 2;
    }
    get center() { return new Point(this.x + this.width / 2, this.y + this.height / 2); }

    set origin(...args) {
        let pt = args[0];
        if (args.length === 2) {
            pt = new Point(args[0], args[1]);
        }
        this.x = pt.x;
        this.y = pt.y;
    }

    get origin() { return new Point(this.x, this.y); }

    *[Symbol.iterator]() { yield* [this.x, this.y, this.width, this.height]; }

    noPoint() {
        return new Rect(0, 0, this.width, this.height);
    }
    containsPoint(...args) {
        let pt = args[0];
        if (args.length === 2) {
            pt = new Point(args[0], args[1]);
        }
        return (pt.x >= this.x && pt.x < this.right &&
                pt.y >= this.y && pt.y < this.bottom);
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

export function linesFromString({string, fontSize, frame}) { //truncates words that are too long
    setFont({size: fontSize});
    const lines = [];
    let spaceIndex, currentLine = "", previousIndex = -1;
    while ((spaceIndex = string.indexOf(" ", previousIndex + 1)) !== -1) {
        const word = string.substring(previousIndex + 1, spaceIndex);
        const [clWidth, wordWidth] = [textWidth(currentLine), textWidth(word)];
        if (clWidth + wordWidth > frame.width) {
            lines.push(currentLine.trim());
            currentLine = word;
            if (wordWidth > frame.width) {
                lines.push(currentLine.substr(0, Math.round(frame.width / wordWidth)));
                currentLine = "";
            }
        }
        else {
            currentLine += ' ' + word;
        }
        previousIndex = spaceIndex;
    }
    currentLine += ' ' + string.substr(string.lastIndexOf(' ') + 1);
    lines.push(currentLine);
    return lines;
}

export function dist(a, b) { //a, b are points
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

export default {dist, linesFromString, aspectFillRect, aspectFitRect, Rect, Size, Point};
