'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {canvas, context, setCanvas} from '../src/canvas';

describe('canvas.js', () => {
    beforeEach(() => setCanvas('game'));
    describe('#setCanvas(id)', () => {
        it('should set the currently active canvas to the one with the given id', () => {
            setCanvas('shop');
            canvas.attr('id').should.equal('shop');
            setCanvas('game');
            canvas.attr('id').should.equal('game');
        });
    });
    it('should export canvas (jQuery object)', () => {
        canvas.should.be.an.instanceof($);
    });
    it('should export the context (canvas[0].context2d(\'2d\'))', () => {
        context.should.equal(canvas[0].getContext('2d'));
    });
    it('should set the width and height of canvas', () => {
        canvas.width().should.equal($(window).width());
        canvas.height().should.equal($(window).height());
    });
});