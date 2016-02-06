'use strict';

import {should as should_} from 'chai';
const should = should_();

import {spy, stub} from 'sinon';

import {Rect, Point, Size} from '../../src/graphical-util';
import Grid from '../../src/grid/grid';
import GridManager from '../../src/grid/grid-manager';

describe('grid-manager.js', () => {
    const gm = new GridManager('game');
    describe('addGrid', () => {
        it('should throw when adding a non-grid', () => {
            (()=>{gm.addGrid(4);}).should.throw(TypeError);
        });
        it('should throw when adding a grid that\'s already in it', () => {
            const grid = new Grid(new Rect(0, 0, 400, 200), new Size(40, 40));
            gm.addGrid(grid);
            (()=>{gm.addGrid(grid);}).should.throw(Error);
            gm.removeGrid(grid);
        });
    });
    describe('removeGrid', () => {
        it('should throw when removing a non-grid', () => {
            (()=>{gm.removeGrid(4);}).should.throw(TypeError);
        });
        it('should throw when removing a grid that\'s not in it', () => {
            const grid = new Grid(new Rect(0, 0, 400, 200), new Size(40, 40));
            (()=>{gm.removeGrid(grid);}).should.throw(Error);
        });
    });
    describe('cellForPointAndGrids', () => {
        it('should return the frameForPoint of the closest grid close enough', () => {
            const grid = new Grid(new Rect(0, 0, 400, 200), new Size(40, 40));
            const pt = new Point(20, 20);
            gm.addGrid(grid);
            gm.cellForPointAndGrids(pt, grid).should.deep.equal(grid.frameForPoint(pt).frame);
        });
    });
});
