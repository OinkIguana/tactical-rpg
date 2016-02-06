'use strict';

import {should as should_} from 'chai';
const should = should_();
import {spy, stub} from 'sinon';

import {setCanvas, canvas, context} from '../src/canvas';
import draw from '../src/draw';
// import {Sprite} from '../../../script/src/sprite';

describe('draw.js', () => {
    let ctx;
    before(() => {
        setCanvas('game');
        // Reset settings
        draw.setFont({reset: true});
        draw.setLine({reset: true});
        draw.setShadow({reset: true});
        ctx = {
            fillRect: stub(context, 'fillRect'),
            strokeRect: stub(context, 'strokeRect'),
            clearRect: stub(context, 'clearRect'),
            fillText: stub(context, 'fillText'),
            strokeText: stub(context, 'strokeText'),
            measureText: spy(context, 'measureText'),
            beginPath: spy(context, 'beginPath'),
            moveTo: spy(context, 'moveTo'),
            lineTo: spy(context, 'lineTo'),
            arc: spy(context, 'arc'),
            arcTo: spy(context, 'arcTo'),
            rect: spy(context, 'rect'),
            quadraticCurveTo: spy(context, 'quadraticCurveTo'),
            bezierCurveTo: spy(context, 'bezierCurveTo'),
            closePath: spy(context, 'closePath'),
            fill: stub(context, 'fill'),
            stroke: stub(context, 'stroke'),
            clip: stub(context, 'clip'),
            drawImage: stub(context, 'drawImage'),
            getImageData: spy(context, 'getImageData'),
            putImageData: stub(context, 'putImageData'),
            createImageData: spy(context, 'createImageData'),
            save: stub(context, 'save'),
            scale: stub(context, 'scale'),
            rotate: stub(context, 'rotate'),
            translate: stub(context, 'translate'),
            transform: stub(context, 'transform'),
            restore: stub(context, 'restore'),
        };
    });

    afterEach(() => {
        for(let i in ctx) {
            ctx[i].reset();
        }
    });

    after(() => {
        for(let i in ctx) {
            ctx[i].restore();
        }
    });

    describe('rect(x, y, w, h, stroke = false)', () => {
        it('should fill a rectangle with a falsey 5th parameter', () => {
            draw.rect(0, 0, 100, 100);
            ctx.fillRect.should.have.been.calledWith(0, 0, 100, 100);
            ctx.strokeRect.should.have.not.been.called;
        });
        it('should stroke a rectangle with a truthy 5th parameter', () => {
            draw.rect(0, 0, 100, 100, true);
            ctx.fillRect.should.have.not.been.called;
            ctx.strokeRect.should.have.been.calledWith(0, 0, 100, 100);
        });
    });
    describe('point(x, y)', () => {
        it('should fill a 1x1 px rectangle', () => {
            draw.point(0, 0);
            ctx.fillRect.should.have.been.calledWith(0, 0, 1, 1);
        });
    });
    describe('circle(x, y, r, stroke = false)', () => {
        it('should fill a circle with a falsey 5th parameter', () => {
            draw.circle(0, 0, 5);
            ctx.beginPath.should.have.been.calledOnce;
            ctx.arc.should.have.been.calledWith(0, 0, 5);
            ctx.fill.should.have.been.calledOnce;
            ctx.stroke.should.have.not.been.called;
        });
        it('should stroke a circle with a truthy 5th parameter', () => {
            draw.circle(0, 0, 5, true);
            ctx.beginPath.should.have.been.calledOnce;
            ctx.arc.should.have.been.calledWith(0, 0, 5);
            ctx.fill.should.have.not.been.called;
            ctx.stroke.should.have.been.calledOnce;
        });
    });
    describe('text(str, x, y, stroke = false)', () => {
        it('should fill the text with a falsey 5th parameter', () => {
            draw.text('Hello World', 0, 0);
            ctx.fillText.should.have.been.calledWith('Hello World', 0, 0);
            ctx.strokeText.should.have.not.been.called;
        });
        it('should stroke the text with a truthy 5th parameter', () => {
            draw.text('Hello World', 0, 0, true);
            ctx.fillText.should.have.not.been.called;
            ctx.strokeText.should.have.been.calledWith('Hello World', 0, 0);
        });
    });
    describe('textWidth(text)', () => {
        it('should not draw any text', () => {
            draw.textWidth('Hello World');
            ctx.measureText.should.have.been.calledWith('Hello World');
            ctx.fillText.should.have.not.been.called;
            ctx.strokeText.should.have.not.been.called;
        });
        it('return a number (the width of the text)', () => {
            draw.text('Hello World');
            draw.textWidth('Hello World').should.be.a('number');
        });
    });
    describe('image(img[, sx, sy, swidth, sheight], x, y[, w, h])', () => {
        it('should draw the image', () => {
            const img = new Image(40, 50);
            draw.image({img: img, swidth: 32, sheight: 32, x: 0, y: 0, width: 32, height: 32});
            draw.image({img: img, sx: 10, sy: 10, x: 0, y: 0, width: 32, height: 32});
            draw.image(img, 20, 20);
            ctx.drawImage.should.have.been.calledThrice;
            ctx.drawImage.should.have.been.calledWith(img, 0, 0, 32, 32, 0, 0, 32, 32);
            ctx.drawImage.should.have.been.calledWith(img, 10, 10, 32, 32, 0, 0, 32, 32);
            ctx.drawImage.should.have.been.calledWith(img, 20, 20);
        });
    });
    describe('pixelData(pd, x, y)', () => {
        it('should be an alias for pd.draw(x, y)', () => {
            const pd = new draw.PixelData(32, 32);
            const fn = stub(pd, 'draw');
            draw.pixelData(pd, 32, 32);
            fn.should.have.been.calledWith(32, 32);
            fn.restore();
        });
    });
    describe('clear()', () => {
        it('should clear the entire canvas', () => {
            draw.clear();
            ctx.clearRect.should.have.been.calledWith(0, 0, canvas.width(), canvas.height());
        });
    });
    describe('setColor(color)', () => {
        it('should set both stroke and fill colors', () => {
            draw.setColor('#ff0000');
            context.fillStyle.should.equal('#ff0000');
            context.strokeStyle.should.equal('#ff0000');
            draw.setColor('#0000ff');
            context.fillStyle.should.equal('#0000ff');
            context.strokeStyle.should.equal('#0000ff');
        });
        it('should accept numbers and convert them to strings', () => {
            draw.setColor(0xff0000);
            context.fillStyle.should.equal('#ff0000');
            context.strokeStyle.should.equal('#ff0000');
            draw.setColor(0x0000ff);
            context.fillStyle.should.equal('#0000ff');
            context.strokeStyle.should.equal('#0000ff');
        });
    });
    describe('setAlpha(alpha)', () => {
        it('should set the global alpha', () => {
            draw.setAlpha(0.5);
            context.globalAlpha.should.equal(0.5);
            draw.setAlpha(1);
            context.globalAlpha.should.equal(1);
        });
        it('should constrain alpha to range [0, 1]', () => {
            draw.setAlpha(-2);
            context.globalAlpha.should.equal(0);
            draw.setAlpha(3);
            context.globalAlpha.should.equal(1);
        });
    });
    describe('setComposite(composite)', () => {
        it('should set the global composite operation', () => {
            draw.setComposite('source-atop');
            context.globalCompositeOperation.should.equal('source-atop');
            draw.setComposite('source-over');
            context.globalCompositeOperation.should.equal('source-over');
        });
    });
    describe('setLine({cap, join, width, miter, reset = false})', () => {
        it('should set the appropriate line properties', () => {
            draw.setLine({cap: 'round'});
            context.lineCap.should.equal('round');

            draw.setLine({width: 15});
            context.lineCap.should.equal('round');
            context.lineWidth.should.equal(15);

            draw.setLine({join: 'bevel'});
            context.lineCap.should.equal('round');
            context.lineWidth.should.equal(15);
            context.lineJoin.should.equal('bevel');

            draw.setLine({miter: 15});
            context.lineCap.should.equal('round');
            context.lineWidth.should.equal(15);
            context.lineJoin.should.equal('bevel');
            context.miterLimit.should.equal(15);

            draw.setLine({cap: 'butt', width: 1, join: 'miter', miter: 10});
            context.lineCap.should.equal('butt');
            context.lineWidth.should.equal(1);
            context.lineJoin.should.equal('miter');
            context.miterLimit.should.equal(10);
        });
        it('should ignore other values if reset is true', () => {
            draw.setLine({reset: true, cap: 'round', width: 10});
            context.lineCap.should.equal('butt');
            context.lineWidth.should.equal(1);
            context.lineJoin.should.equal('miter');
            context.miterLimit.should.equal(10);
        });
    });

    describe('setShadow({x, y, blur, color, reset = false})', () => {
        it('should set the appropriate shadow properties', () => {
            draw.setShadow({x: 5});
            context.shadowOffsetX.should.equal(5);

            draw.setShadow({y: 10});
            context.shadowOffsetX.should.equal(5);
            context.shadowOffsetY.should.equal(10);

            draw.setShadow({blur: 15});
            context.shadowOffsetX.should.equal(5);
            context.shadowOffsetY.should.equal(10);
            context.shadowBlur.should.equal(15);

            draw.setShadow({color: 0xff0000});
            context.shadowOffsetX.should.equal(5);
            context.shadowOffsetY.should.equal(10);
            context.shadowBlur.should.equal(15);
            context.shadowColor.should.equal('#ff0000');

            draw.setShadow({color: '#0000ff'});
            context.shadowOffsetX.should.equal(5);
            context.shadowOffsetY.should.equal(10);
            context.shadowBlur.should.equal(15);
            context.shadowColor.should.equal('#0000ff');

            draw.setShadow({x: 0, y: 0, blur: 0, color: '#000000'});
            context.shadowOffsetX.should.equal(0);
            context.shadowOffsetY.should.equal(0);
            context.shadowBlur.should.equal(0);
            context.shadowColor.should.equal('#000000');
        });
        it('should ignore other values if reset is passed', () => {
            draw.setShadow({x: 5, y: 5, blur: 3, color: '#00FF00', reset: true});
            context.shadowOffsetX.should.equal(0);
            context.shadowOffsetY.should.equal(0);
            context.shadowBlur.should.equal(0);
            context.shadowColor.should.equal('#000000');
        });
    });

    describe('setFont({family, size, align, baseline, reset = false})', () => {
        it('should set the appropriate font properties', () => {
            draw.setFont({size: 15});
            context.font.should.equal('15px sans-serif');

            draw.setFont({family: 'serif'});
            context.font.should.equal('15px serif');

            draw.setFont({align: 'center'});
            context.font.should.equal('15px serif');
            context.textAlign.should.equal('center');

            draw.setFont({baseline: 'top'});
            context.font.should.equal('15px serif');
            context.textAlign.should.equal('center');
            context.textBaseline.should.equal('top');

            draw.setFont({family: 'sans-serif', size: 10, align: 'start', baseline: 'alphabetic'});
            context.font.should.equal('10px sans-serif');
            context.textAlign.should.equal('start');
            context.textBaseline.should.equal('alphabetic');
        });
        it('should ignore other values if reset is passed', () => {
            draw.setFont({family: 'serif', size: 15, align: 'top', baseline: 'middle', reset: true});
            context.font.should.equal('10px sans-serif');
            context.textAlign.should.equal('start');
            context.textBaseline.should.equal('alphabetic');
        });
    });

    describe('transformed({scale: {x: 1, y: 1}, rotate, translate: {x: 0, y: 0}, transform: [1, 0, 0, 1, 0, 0]}, ...todo)', () => {
        it('should context.save() at the beginning, context.restore() at the end, and other functions inbetween', () => {
            const cb = spy();
            draw.transformed({scale: {x: 2, y: 2}, rotate: 50, translate: {x: 15, y: 30}, transform: [1, 0, 0, 1, 0, 0]}, cb);
            ctx.save.should.have.been.calledBefore(ctx.scale);
            ctx.scale.should.have.been.calledBefore(ctx.rotate);
            ctx.rotate.should.have.been.calledBefore(ctx.translate);
            ctx.translate.should.have.been.calledBefore(ctx.transform);
            ctx.transform.should.have.been.calledBefore(cb);
            cb.should.have.been.calledOnce;
            ctx.restore.should.have.been.calledAfter(cb);
        });
        it('should call all functions passed in order', () => {
            const cbs = [spy(), spy(), spy()];
            draw.transformed({}, ...cbs);
            cbs[0].should.have.been.calledOnce;
            cbs[0].should.have.been.calledBefore(cbs[1]);
            cbs[1].should.have.been.calledOnce;
            cbs[1].should.have.been.calledBefore(cbs[2]);
            cbs[2].should.have.been.calledOnce;
        });
    });

    describe('Path', () => {
        it('should be constructed with new Path()', () => {
            new draw.Path().should.be.an.instanceof(draw.Path);
            (() => draw.Path()).should.throw(TypeError);
            ctx.beginPath.should.not.have.been.called;
        });
        describe('#length', () => {
            it('should return the number of actions in the stack', () => {
                new draw.Path().move().line().length.should.equal(2);
            });
            it('should not include the initial beginPath call', () => {
                new draw.Path().length.should.equal(0);
            });
        });
        describe('#move(x, y)', () => {
            it('should add context.moveTo(x, y) to the stack', () => {
                const p = new draw.Path().move(32, 32);
                p.length.should.equal(1);
                p.stroke();
                ctx.moveTo.should.have.been.calledWith(32, 32);
            });
            it('should not call context.moveTo(x, y)', () => {
                new draw.Path().move(32, 32);
                ctx.moveTo.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().move(32, 32).move(16, 16)).should.not.throw();
            });
        });
        describe('#line(x, y)', () => {
            it('should add context.lineTo(x, y) to the stack', () => {
                const p = new draw.Path().line(32, 32);
                p.length.should.equal(1);
                p.stroke();
                ctx.lineTo.should.have.been.calledWith(32, 32);
            });
            it('should not call context.lineTo(x, y)', () => {
                new draw.Path().line(32, 32);
                ctx.lineTo.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().line(32, 32).line(16, 16)).should.not.throw();
            });
        });
        describe('#rect(x, y, w, h)', () => {
            it('should add context.rect(x, y, w, h) to the stack', () => {
                const p = new draw.Path().rect(16, 16, 32, 32);
                p.length.should.equal(1);
                p.stroke();
                ctx.rect.should.have.been.calledWith(16, 16, 32, 32);
            });
            it('should not call context.rect(x, y)', () => {
                new draw.Path().rect(32, 32, 16, 16);
                ctx.rect.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().rect(16, 16, 32, 32).rect(32, 32, 16, 16)).should.not.throw();
            });
        });
        describe('#arc(x, y, r, start, end[, ccw])', () => {
            it('should add context.arc(x, y, r, start, end[, ccw]) to the stack', () => {
                const p = new draw.Path().arc(32, 32, 32, 0, Math.PI, false);
                p.length.should.equal(1);
                p.stroke();
                ctx.arc.should.have.been.calledWith(32, 32, 32, 0, Math.PI, false);
            });
            it('should not call context.arc(x, y, r, start, end[, ccw])', () => {
                new draw.Path().arc(32, 32, 32, 0, Math.PI, false);
                ctx.arc.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().arc(32, 32, 32, 0, Math.PI, false).arc(32, 32, 32, 0, Math.PI, false)).should.not.throw();
            });
        });
        describe('#curve(x1, y1, x2, y2, r)', () => {
            it('should add context.arcTo(x1, y1, x2, y2, r) to the stack', () => {
                const p = new draw.Path().curve(32, 32, 32, 64, 32);
                p.length.should.equal(1);
                p.stroke();
                ctx.arcTo.should.have.been.calledWith(32, 32, 32, 64, 32);
            });
            it('should not call context.arcTo(x1, y1, x2, y2, r)', () => {
                new draw.Path().curve(32, 32, 32, 64, 32);
                ctx.arcTo.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().curve(32, 32, 32, 64, 32).curve(32, 96, 64, 96, 32)).should.not.throw();
            });
        });

        describe('#bezier(x1, y1, x2, y2[, x3, y3])', () => {
            it('should add context.quadraticCurveTo(x1, y1, x2, y2) to the stack when called with 4 arguments', () => {
                const p = new draw.Path().bezier(32, 32, 32, 64);
                p.length.should.equal(1);
                p.stroke();
                ctx.quadraticCurveTo.should.have.been.calledWith(32, 32, 32, 64);
            });
            it('should add context.bezierCurveTo(x1, y1, x2, y2, x3, y3) to the stack when called with 6 arguments', () => {
                const p = new draw.Path().bezier(32, 32, 32, 64, 64, 64);
                p.length.should.equal(1);
                p.stroke();
                ctx.bezierCurveTo.should.have.been.calledWith(32, 32, 32, 64, 64, 64);
            });
            it('should not call context.quadraticCurveTo(x1, y1, x2, y2) or context.bezierCurveTo(x1, y1, x2, y2, x3, y3)', () => {
                new draw.Path().bezier(32, 32, 32, 64).bezier(32, 32, 32, 64, 64, 64);
                ctx.quadraticCurveTo.should.not.have.been.called;
                ctx.bezierCurveTo.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().bezier(32, 32, 32, 64).bezier(32, 32, 32, 64, 64, 64).move(32, 32)).should.not.throw();
            });
        });

        describe('#close()', () => {
            it('should add context.closePath() to the stack', () => {
                const p = new draw.Path().close();
                p.length.should.equal(1);
                p.stroke();
                ctx.closePath.should.have.been.calledOnce;
            });
            it('should not call context.close', () => {
                new draw.Path().close();
                ctx.closePath.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().close().close()).should.not.throw();
            });
        });

        describe('#do(fn)', () => {
            it('should add a given fn to the stack', () => {
                const cb = spy();
                const p = new draw.Path().do(cb);
                p.length.should.equal(1);
                p.stroke();
                cb.should.have.been.calledOnce;
            });
            it('should not call fn', () => {
                const cb = spy();
                const p = new draw.Path().do(cb);
                cb.should.not.have.been.called;
            });
            it('should be chainable', () => {
                (() => new draw.Path().do(() => {}).do(() => {})).should.not.throw();
            });
        });

        describe('#fill({color, shadow, transform})', () => {
            it('should call context.save() at the beginning, context.restore() at the end, and context.fill() in the middle', () => {
                new draw.Path().move(32, 32).line(64, 64).fill();
                ctx.save.should.have.been.calledBefore(ctx.fill);
                ctx.fill.should.have.been.calledBefore(ctx.restore);
                ctx.restore.should.have.been.called;
            });
            it('should set the color, shadow, and transform if they are specified', () => {
                new draw.Path().move(32, 32).do(() => {
                    context.fillStyle.should.equal('#ff0000');
                    context.shadowBlur.should.equal(5);
                    ctx.translate.should.have.been.calledWith(5, 0);
                }).line(64, 64).fill({
                    color: 0xff0000,
                    shadow: {
                        blur: 5
                    },
                    transform: {
                        translate: {
                            x: 5
                        }
                    }
                });
            });
            it('should call the entire stack in order', () => {
                new draw.Path().move(32, 32).line(64, 64).arc(32, 32, 0, 0, 3).rect(32, 32, 32, 32).fill();
                ctx.beginPath.should.have.been.calledBefore(ctx.moveTo);
                ctx.moveTo.should.have.been.calledBefore(ctx.lineTo);
                ctx.lineTo.should.have.been.calledBefore(ctx.arc);
                ctx.arc.should.have.been.calledBefore(ctx.rect);
                ctx.rect.should.have.been.calledBefore(ctx.fill);
            });
            it('should be chainable', () => {
                (() => new draw.Path().fill().fill({transform: {}, shadow: {}, color: 0x000000})).should.not.throw();
            });
        });

        describe('#stroke({color, line, transform})', () => {
            it('should call context.save() at the beginning, context.restore() at the end, and context.stroke() in the middle', () => {
                new draw.Path().move(32, 32).line(64, 64).stroke();
                ctx.save.should.have.been.calledBefore(ctx.stroke);
                ctx.stroke.should.have.been.calledBefore(ctx.restore);
                ctx.restore.should.have.been.called;
            });
            it('should set the color, line, and transform if they are specified', () => {
                new draw.Path().move(32, 32).do(() => {
                    context.strokeStyle.should.equal('#ff0000');
                    context.lineWidth.should.equal(5);
                    ctx.translate.should.have.been.calledWith(5, 0);
                }).line(64, 64).stroke({
                    color: 0xff0000,
                    line: {
                        width: 5
                    },
                    transform: {
                        translate: {
                            x: 5
                        }
                    }
                });
            });
            it('should call the entire stack in order', () => {
                new draw.Path().move(32, 32).line(64, 64).arc(32, 32, 0, 0, 3).rect(32, 32, 32, 32).stroke();
                ctx.beginPath.should.have.been.calledBefore(ctx.moveTo);
                ctx.moveTo.should.have.been.calledBefore(ctx.lineTo);
                ctx.lineTo.should.have.been.calledBefore(ctx.arc);
                ctx.arc.should.have.been.calledBefore(ctx.rect);
                ctx.rect.should.have.been.calledBefore(ctx.stroke);
            });
            it('should be chainable', () => {
                (() => new draw.Path().stroke().stroke({transform: {}, line: '', color: 0x000000}).stroke()).should.not.throw();
            });
        });

        describe('#doInside([{transform},] ...todo)', () => {
            it('should call context.save() at the beginning, context.restore() at the end, and context.clip() in the middle', () => {
                new draw.Path().rect(32, 32, 64, 64).doInside(() => {});
                ctx.save.should.have.been.calledBefore(ctx.clip);
                ctx.clip.should.have.been.calledBefore(ctx.restore);
                ctx.restore.should.have.been.called;
            });
            it('should set the transform if given', () => {
                new draw.Path().rect(32, 32, 64, 64).doInside({
                    translate: {
                        x: 5
                    }
                }, () => {
                    ctx.translate.should.have.been.called;
                });
            });
            it('should call the entire stack in order', () => {
                new draw.Path().move(32, 32).line(64, 64).arc(32, 32, 0, 0, 3).rect(32, 32, 32, 32).doInside();
                ctx.beginPath.should.have.been.calledBefore(ctx.moveTo);
                ctx.moveTo.should.have.been.calledBefore(ctx.lineTo);
                ctx.lineTo.should.have.been.calledBefore(ctx.arc);
                ctx.arc.should.have.been.calledBefore(ctx.rect);
                ctx.rect.should.have.been.calledBefore(ctx.clip);
            });
            it('should call all items in todo in order, after clipping', () => {
                const cbs = [spy(), spy(), spy()];
                new draw.Path().rect(32, 32, 64, 64).doInside(...cbs);
                ctx.clip.should.have.been.calledBefore(cbs[0]);
                cbs[0].should.have.been.calledOnce;
                cbs[0].should.have.been.calledBefore(cbs[1]);
                cbs[1].should.have.been.calledOnce;
                cbs[1].should.have.been.calledBefore(cbs[2]);
                cbs[2].should.have.been.calledOnce;
            });
            it('should be chainable', () => {
                (() => new draw.Path().doInside({}, () => {}).doInside(() => {}).doInside()).should.not.throw();
            });
        });

        describe('#copy()', () => {
            it('should make an identical Path', () => {
                const p = new draw.Path().move(32, 32).line(64, 64);
                const c = p.copy();
                c.should.be.an.instanceof(draw.Path);
                c.length.should.deep.equal(p.length);
            });
            it('should not modify the original when the copy is changed used', () => {
                const p = new draw.Path().move(32, 32).line(64, 64);
                const c = p.copy().arc(64, 64, 32, 0, Math.PI * 2);
                p.length.should.not.equal(c.length);
            });
        });

        describe('#contains([offx, offy,] x, y)', () => {
            it('should be true if the point is within the path', () => {
                new draw.Path().move(0, 32).line(32, 32).contains(16, 32).should.be.true;
                new draw.Path().move(0, 32).line(32, 32).line(32, 64).contains(30, 34).should.be.true;
            });
            it('should be true if the point is not within the path', () => {
                new draw.Path().move(0, 32).line(32, 32).contains(48, 32).should.be.false;
                new draw.Path().move(0, 32).line(32, 32).contains(16, 16).should.be.false;
            });
            it('should allow offsets to be specified', () => {
                new draw.Path().move(0, 32).line(32, 32).line(32, 64).contains(130, 134).should.be.false;
                new draw.Path().move(0, 32).line(32, 32).line(32, 64).contains(100, 100, 130, 134).should.be.true;
            });
        });
    });

    describe('PixelData', () => {
        const [width, height] = [32, 32];
        let pd;
        before(() => pd = new draw.PixelData(width, height));

        it('should be constructed with new PixelData([x, y,] w, h)', () => {
            new draw.PixelData(32, 32).should.be.an.instanceof(draw.PixelData);
            new draw.PixelData(16, 16, 16, 16).should.be.an.instanceof(draw.PixelData);
            ctx.createImageData.should.have.been.calledWith(32, 32);
            ctx.getImageData.should.have.been.calledWith(16, 16, 16, 16);
            (() => draw.PixelData(32, 32)).should.throw(TypeError);
        });

        describe('#width', () => {
            it('should return the width of the PixelData', () => {
                pd.width.should.equal(32);
            });
            it('should be read only', () => {
                (() => pd.width = 16).should.throw(TypeError);
            });
        });

        describe('#height', () => {
            it('should return the height of the PixelData', () => {
                pd.height.should.equal(32);
            });
            it('should be read only', () => {
                (() => pd.height = 16).should.throw(TypeError);
            });
        });

        describe('#data[x][y]', () => {
            it('should return a pixel from the ImageData', () => {
                pd.data[16][16].should.deep.equal([0, 0, 0, 0]);
            });
        });

        describe('#data[x][y]=', () => {
            it('should be settable to change the ImageData', () => {
                pd.data[16][16] = [255, 0, 0, 255];
                pd.data[16][16].should.deep.equal([255, 0, 0, 255]);
                pd.data[16][16] = [0, 0, 0, 0];
                pd.data[16][16].should.deep.equal([0, 0, 0, 0]);
            });

            it('should not work with only one index', () => {
                (() => pd.data[16] = [255, 0, 0, 255]).should.throw(TypeError);
            });
        });

        describe('#draw(x, y)', () => {
            it('should draw the PixelData', () => {
                pd.draw(32, 32);
                ctx.putImageData.should.have.been.calledOnce;
            });
        });
    });
});
