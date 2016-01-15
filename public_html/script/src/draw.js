/*
    Wrapper around the default canvas drawing functions to make them more usable
*/
'use strict';
import {canvas, context, setCanvas} from './canvas';
import {pad, range} from './util';

const [GENERATE, STACK, IMAGE_DATA] = [Symbol('GENERATE'), Symbol('STACK'), Symbol('IMAGE_DATA')];

export const rect = (x, y, w, h, stroke = false) => {
    if(stroke) {
        context.strokeRect(x, y, w, h);
    } else {
        context.fillRect(x, y, w, h);
    }
};

export const point = (x, y) => context.fillRect(x, y, 1, 1);

export const circle = (x, y, r, stroke = false) => {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    if(stroke) {
        context.stroke();
    } else {
        context.fill();
    }
};

export const text = (str, x, y, stroke = false) => {
    if(stroke) {
        context.strokeText(str, x, y);
    } else {
        context.fillText(str, x, y);
    }
};
export const textWidth = (str) => {
    return context.measureText(str).width;
};

export const image = (...args) => {
    context.drawImage(...args);
};

export const sprite = (spr, subimage, x, y, w, h) => {
    if(spr.image instanceof Image) {
        context.drawImage(spr.image, ...spr.frames[subimage], x, y, w || spr.frames[subimage].w, h || spr.frames[subimage].h);
    }
};

export const pixelData = (pd, x, y) => {
    pd.draw(x, y);
};

export const clear = () => context.clearRect(0, 0, canvas.width(), canvas.height());

export const setColor = (c) => {
    context.fillStyle = context.strokeStyle = (typeof c === 'number' ? '#' + pad(c.toString(16), 6, '0') : c);
};
export const setAlpha = (a) => context.globalAlpha = range(0, 1, 0).constrain(a);
export const setComposite = (o) => context.globalCompositeOperation = o;

export const setLine = ({cap, join, width, miter, reset} = {}) => {
    if(reset === true) { return setLine({cap: 'butt', join: 'miter', width: 1, miter: 10}); }
    if(cap !== undefined)   { context.lineCap = cap; }
    if(join !== undefined)  { context.lineJoin = join; }
    if(width !== undefined) { context.lineWidth = width; }
    if(miter !== undefined) { context.miterLimit = miter; }
};
export const setShadow = ({x, y, blur, color, reset} = {}) => {
    if(reset === true) { return setShadow({x: 0, y: 0, blur: 0, color: '#000000'}); }
    if(x !== undefined)     { context.shadowOffsetX = x; }
    if(y !== undefined)     { context.shadowOffsetY = y; }
    if(blur !== undefined)  { context.shadowBlur = blur; }
    if(color !== undefined) {
        context.shadowColor = (typeof color === 'number' ? '#' + pad(color.toString(16), 6, '0') : color);
    }
};

let [fontSize, fontFamily] = [10, 'sans-serif'];
export const setFont = ({family, size, align, baseline, reset} = {}) => {
    if(reset === true) { return setFont({family: 'sans-serif', size: 10, align: 'start', baseline: 'alphabetic'}); }
    if(family !== undefined)    { fontFamily = family; }
    if(size !== undefined)      { fontSize = size; }
    context.font = `${fontSize}px ${fontFamily}`;
    if(align !== undefined)     { context.textAlign = align; }
    if(baseline !== undefined)  { context.textBaseline = baseline; }
};

// Transform the context and perform the given function(s)
export const transformed = (opts, ...todo) => {
    context.save();
    if(opts) {
        if(opts.scale)      { context.scale(opts.scale.x || 1, opts.scale.y || 1);}
        if(opts.rotate)     { context.rotate(opts.rotate); }
        if(opts.translate)  { context.translate(opts.translate.x || 0, opts.translate.y || 0); }
        if(opts.transform)  { context.transform(...opts.transform); }
    }
    for(let item of todo) { item(); }
    context.restore();
};

// Chained, saveable, easy to use context2d paths
export const Path = class {
    constructor() {
        this[STACK] = [() => context.beginPath()];
    }

    move(...args) {
        this[STACK].push(() => context.moveTo(...args));
        return this;
    }
    line(...args) {
        this[STACK].push(() => context.lineTo(...args));
        return this;
    }
    rect(...args) {
        this[STACK].push(() =>  context.rect(...args));
        return this;
    }
    arc(...args) {
        this[STACK].push(() => context.arc(...args));
        return this;
    }
    curve(...args) {
        this[STACK].push(() => context.arcTo(...args));
        return this;
    }
    bezier(...args) {
        if(args.length === 6) {
            this[STACK].push(() => context.bezierCurveTo(...args));
        } else {
            this[STACK].push(() => context.quadraticCurveTo(...args));
        }
        return this;
    }

    close() {
        this[STACK].push(() => context.closePath());
        return this;
    }

    do(fn) {
        this[STACK].push(() => fn(this));
        return this;
    }

    fill({color, shadow, transform} = {}) {
        if(transform !== undefined) {
            transformed(transform, () => this.fill({color: color, shadow: shadow}));
            return this;
        }
        context.save();
        if(color !== undefined) { setColor(color); }
        if(shadow !== undefined) { setShadow(shadow); }
        this[GENERATE]();
        context.fill();
        context.restore();
        return this;
    }

    stroke({color, line, transform} = {}) {
        if(transform !== undefined) {
            transformed(transform, () => this.stroke({color: color, line: line}));
            return this;
        }
        context.save();
        if(color !== undefined) { setColor(color); }
        if(line !== undefined) { setLine(line); }
        this[GENERATE]();
        context.stroke();
        context.restore();
        return this;
    }

    doInside(transform, ...todo) {
        // Optional transform
        if(transform !== undefined && todo.length !== 0) {
            if(typeof transform !== 'function') {
                transformed(transform, () => this.doInside(...todo));
                return this;
            } else {
                todo = [transform, ...todo];
            }
        }
        context.save();
        setShadow({reset: true}); // Clip doesn't work if shadow is not default??
        this[GENERATE]();
        context.clip();
        for(let item of todo) { item(); }
        context.restore();
        return this;
    }

    contains(...args) {
        this[GENERATE]();
        if(args.length === 2) {
            return context.isPointInPath(...args);
        } else {
            return context.isPointInPath(args[2] - args[0], args[3] - args[1]);
        }
    }

    copy() {
        const cp = new Path();
        cp[STACK] = [...this[STACK]];
        return cp;
    }

    get length() {
        return this[STACK].length - 1;
    }

    [GENERATE]() { for(let item of this[STACK]) { item(); } }
};

// Wrapper around built in context2d.ImageData
export const PixelData = class {
    constructor(...args) {
        this[IMAGE_DATA] = (args.length === 4) ? context.getImageData(...args) : context.createImageData(...args);
    }

    get width() { return this[IMAGE_DATA].width; }
    get height() { return this[IMAGE_DATA].height; }
    get data() {
        // Provide 2D array style access to the 1D array
        if(window.Proxy !== undefined) {
            return new Proxy(this, {
                get(target, x) {
                    x = parseInt(x);
                    return new Proxy(target, {
                        get(target, y) {
                            const ind = 4 * (y * target[IMAGE_DATA].width + x);
                            return [...target[IMAGE_DATA].data.slice(ind, ind + 4)];
                        },
                        set(target, y, value) {
                            const ind = 4 * (y * target[IMAGE_DATA].width + x);
                            [target[IMAGE_DATA].data[ind], target[IMAGE_DATA].data[ind + 1],
                             target[IMAGE_DATA].data[ind + 2], target[IMAGE_DATA].data[ind + 3]] = value;
                            return true;
                        }
                    });
                },
                set() { throw new TypeError('Cannot set pixel with only one coordinate'); }
            });
        } else {
            // Fallback for browsers without Proxy (Everything but Firefox...)
            const obj = {};
            for(let x = 0; x < this[IMAGE_DATA].width; x++) {
                Object.defineProperty(obj, x, {
                    get() {
                        const obj = {};
                        for(let y = 0; y < this[IMAGE_DATA].height; y++) {
                            const ind = 4 * (y * this[IMAGE_DATA].width + x);
                            Object.defineProperty(obj, y, {
                                get() { return [...this[IMAGE_DATA].data.slice(ind, ind + 4)]; },
                                set(value) {
                                    [this[IMAGE_DATA].data[ind], this[IMAGE_DATA].data[ind + 1],
                                     this[IMAGE_DATA].data[ind + 2], this[IMAGE_DATA].data[ind + 3]] = value;
                                    return true;
                                }
                            });
                        }
                        return obj; },
                    set(value) {
                        throw new TypeError('Cannot set pixel with only one coordinate');
                    }
                });
            }
            return obj;
        }
    }

    draw(x, y) {
        context.putImageData(this[IMAGE_DATA], x, y);
    }
};

export default {
    rect, point, circle, text, textWidth, image, pixelData, sprite, clear,
    setColor, setAlpha, setComposite, setLine, setShadow, setFont, transformed,
    Path, PixelData
};