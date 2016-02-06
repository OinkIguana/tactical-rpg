'use strict';

import {should as should_} from 'chai';
const should = should_();

import {spy, stub} from 'sinon';

import {Rect, Point, Size} from '../../src/graphical-util';
import Grid from '../../src/grid/grid';
import GridManager from '../../src/grid/grid-manager';
import RootDrawable from '../../src/drawable/root-drawable';
import Draggable from '../../src/draggable/draggable';
import DraggableGrid from '../../src/draggable/draggable-grid';

describe('draggable-grid.js', () => {
    describe('onMouseUp', () => {
        it('should animate the draggable-grid to a grid cell', () => {
            const grid = new Grid(new Rect(0, 0, 400, 400), new Size(40, 40));
            const dg = new DraggableGrid({
                frame: new Rect(0, 0, 40, 40),
                grids: grid,
            });
            const root = new RootDrawable({frame: new Rect(0, 0, 800, 800), canvasID: 'game'});
            const gm = new GridManager('game');
            gm.addGrid(grid);
            root.gridManager = gm;
            let fn = spy(dg, 'animateToPoint');
            root.addChild(dg);
            dg.onMouseDown({pageX: dg.frame.center.x, pageY: dg.frame.center.y});
            dg.onMouseUp();
            fn.should.have.been.called;
        });
    });
});
