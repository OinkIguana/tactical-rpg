'use strict';

import {expect} from 'chai';
import $ from 'jquery';

import {canvas, context, setCanvas} from '../../public_html/script/src/canvas.js';

describe('canvas.js', () => {
    beforeEach(() => setCanvas('game'));
    describe('#setCanvas(id)', () => {
        it('should set the currently active canvas to the one with the given id', () => {
            setCanvas('story');
            expect(canvas.attr('id')).to.equal('story');
            setCanvas('game');
            expect(canvas.attr('id')).to.equal('game');
        });
    });
    it('should export canvas (jQuery object)', () => {
        expect(canvas).to.be.an.instanceof($);
    });
    it('should export the context (canvas[0].context2d(\'2d\'))', () => {
        expect(context).to.equal(canvas[0].getContext('2d'));
    });
    it('should set the width and height of canvas', () => {
        expect(canvas.width()).to.equal($(window).width());
        expect(canvas.height()).to.equal($(window).height());
    });
});