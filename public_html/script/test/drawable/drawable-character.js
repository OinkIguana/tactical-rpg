'use strict';

import {should as should_} from 'chai';
const should = should_();

import $ from 'jquery';

import {Rect} from '../../src/util.js';
import {DrawableCharacter, Direction} from '../../src/drawable/drawable-character.js';

describe('drawable-character.js', () => {
    const character = new DrawableCharacter({
        frame: new Rect(20, 20, 40, 30),
        imageSet: new Image(800, 800),
        subImageWidth: 40,
        subImageHeight: 30,
        imagesetBoundsList: [
            new Rect(0, 0, 800, 200), new Rect(0, 200, 800, 200),
            new Rect(0, 400, 800, 200), new Rect(0, 600, 800, 200)
        ]
    });
    describe('new DrawableCharacter', () => {
        it('should return a valid DrawableCharacter', () => {
            character.should.be.an.instanceof(DrawableCharacter);
        });
    });

    describe('set direction', () => {
        it('should throw a TypeError if direction is not in the Direction enum', () => {
            (() => character.direction = 5).should.throw(TypeError);
        });
        it('should modify DrawableSprite[SUBIMAGE_BOUNDS] correctly', () => {
            character.direction = Direction.down;
            const bounds = character.subImageBounds;
            character.direction = Direction.left;
            bounds.should.not.deep.equal(character.subImageBounds);
            character.direction = Direction.down;
            bounds.should.deep.equal(character.subImageBounds);
        });
    });
});
