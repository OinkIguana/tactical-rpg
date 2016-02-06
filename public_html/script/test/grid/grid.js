'use strict';

import {should as should_} from 'chai';
const should = should_();

import {spy, stub} from 'sinon';

import {Rect, Point, Size} from '../../src/graphical-util';
import Grid from '../../src/grid/grid';

describe('grid.js', () => {
    const grid = new Grid(new Rect(0, 0, 400, 200), new Size(40, 40));
    describe('new Grid', () => {
        it('should return a valid Grid object', () => {
            grid.should.be.an.instanceof(Grid);
        });
        it('should set a default value to cellSpacing', () => {
            should.exist(grid.cellSpacing);
        });
        it('should throw on bad params', () => {
            (()=>{new Grid("not a rect", new Size(40, 40));}).should.throw(TypeError);
            (()=>{new Grid(new Rect(0, 0, 400, 200), "not a size");}).should.throw(TypeError);
            (()=>{new Grid();}).should.throw(TypeError);
        });
    });
    describe('frameForPoint', () => {
        it('should return undefined if there\'s no cell close enough', () => {
            should.not.exist(grid.frameForPoint(new Point(500, 100), 0));
        });
        it('should return an object containing a cell frame in it otherwise', () => {
            const cellFrame = grid.frameForPoint(new Point(100, 100)).frame;
            grid.frame.containsPoint(cellFrame.center.x, cellFrame.center.y).should.equal(true);
            cellFrame.width.should.equal(40);
            cellFrame.height.should.equal(40);
        });
    });
});
