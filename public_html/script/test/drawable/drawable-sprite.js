'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {Rect} from '../../src/util.js';
import DrawableSprite from '../../src/drawable/drawable-sprite.js';

describe('drawable-sprite.js', () => {
    const sprite = new DrawableSprite({frame: new Rect(20, 20, 40, 30),
            imageSet: new Image(800, 800), subImageWidth: 40, subImageHeight: 40,
            imageSetBounds: new Rect(0, 200, 400, 400)});
    describe('new DrawableSprite', () => {
        it('should return a valid DrawableSprite', () => {
            sprite.should.be.an.instanceof(DrawableSprite);
        });
    });

    describe('setupSubImageBounds', () => {
        it("should populate subImageBounds with the correct number of subimages", () => {
            sprite.subImageBounds.length.should.eql(100);
        });
        it("should populate subImageBounds with correctly sized subimages", () => {
            sprite.subImageBounds[0].width.should.eql(40);
        });
    });
});
