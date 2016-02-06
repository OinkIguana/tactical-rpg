'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {spy, stub} from 'sinon';

import {Rect} from '../../src/graphical-util';
import draw from '../../src/draw';
import RootDrawable from '../../src/drawable/root-drawable';
import {DrawableImage, ScaleMode} from '../../src/drawable/drawable-image';

describe('drawable-image.js', () => {
    const dImage = new DrawableImage({
        frame: new Rect(20, 20, 400, 300),
        bgImage: new Image(800, 800),
        imageFrame: new Rect(40, 60, 100, 80)
    });
    const root = new RootDrawable({frame: new Rect(0, 0, 300, 45), canvasID: 1});
    root.addChild(dImage);
    let fns;
    before(() => {
        fns = {
            image: stub(draw, 'image')
        };
    });
    after(() => {
        fns.image.restore();
    });
    describe('new DrawableImage', () => {
        it('should return a valid DrawableImage', () => {
            dImage.should.be.an.instanceof(DrawableImage);
        });
        it('should set scaleMode to ScaleMode.toFill if an imageFrame is passed', () => {
            (dImage.scaleMode === ScaleMode.toFill).should.be.ok;
            //dImage.scaleMode.should.equal(ScaleMode.toFill);
        });
    });

    describe('draw', () => {
        it('should draw an image', (done) => {
            dImage.draw(30, 30);
            setTimeout(() => {
                fns.image.should.have.been.called;
                fns.image.args[0].should.deep.equal(dImage.backgroundImage);
                done();
            }, 0);
        });
    });

    it('should throw when passed non Images for Image properties', () => {
        (() => { dImage.backgroundImage = 3; }).should.throw(TypeError);
        (() => { dImage.backgroundImage = new Image(400, 400); }).should.not.throw(TypeError);
        (() => { new DrawableImage({bgImage: "Image"}); }).should.throw(TypeError);
    });
});
