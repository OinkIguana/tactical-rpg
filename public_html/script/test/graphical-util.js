'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {spy, stub} from 'sinon';

import gUtil from '../src/graphical-util';
import draw from '../src/draw';
import {setCanvas} from '../src/canvas';

describe('graphical-util.js', () => {

    describe('Rect', () => {
        it('should assign and return origin correctly', () => {
            const rect = new gUtil.Rect(20, 30, 40, 50);
            rect.origin.should.deep.equal(new gUtil.Point(20, 30));
            rect.origin = new gUtil.Point(40, -10);
            rect.x.should.equal(40);
            rect.y.should.equal(-10);
        });
        it('should assign and return right correctly', () => {
            const rect = new gUtil.Rect(20, 30, 40, 50);
            rect.right.should.equal(60);
            rect.right = 90;
            rect.x.should.equal(50);
        });
        it('should assign and return bottom correctly', () => {
            const rect = new gUtil.Rect(20, 30, 40, 50);
            rect.bottom.should.equal(80);
            rect.bottom = -20;
            rect.y.should.equal(-70);
        });
        it('should assign and return center correctly', () => {
            const rect = new gUtil.Rect(20, 30, 40, 50);
            rect.center.should.deep.equal(new gUtil.Point(40, 55));
            rect.center = new gUtil.Point(0, 0);
            rect.x.should.equal(-20);
            rect.y.should.equal(-25);
        });
    });

    describe('aspectFitRect', () => {
        it('should return the correct frame', () => {
            const boundingRect = new gUtil.Rect(20, 20, 40, 40);
            gUtil.aspectFitRect(boundingRect, 0.5).should.deep.equal(new gUtil.Rect(30, 20, 20, 40));
            gUtil.aspectFitRect(boundingRect, 2).should.deep.equal(new gUtil.Rect(20, 30, 40, 20));
        });
    });

    describe('aspectFillRect', () => {
        it('should return the correct frame', () => {
            const boundingRect = new gUtil.Rect(20, 20, 40, 40);
            gUtil.aspectFillRect(boundingRect, 0.5).should.deep.equal(new gUtil.Rect(20, 0, 40, 80));
            gUtil.aspectFillRect(boundingRect, 2).should.deep.equal(new gUtil.Rect(0, 20, 80, 40));
        });
    });

    describe('linesFromString', () => {
        it('should return a correctly formatted list', () => {
            setCanvas('game').should.equal(true);
            let size = 14, width = 75, str = 'one two three four five six seven eight nine ten';
            const lines = gUtil.linesFromString({
                string: str,
                fontSize: size,
                frame: new gUtil.Rect(200, 200, width, 80)
            });
            lines.should.be.an.instanceof(Array);
            lines[0].should.be.a('string');
            draw.setFont({size: size});
            let curString = '';
            for (let line of lines) {
                draw.textWidth(line).should.be.below(width + 3);
                curString += line.trim() + ' ';
            }
            curString.trim().should.equal(str);
        });
    });

});
