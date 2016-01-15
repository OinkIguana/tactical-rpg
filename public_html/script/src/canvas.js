/*
    Set up/provide access to the canvas
*/
'use strict';
import $ from 'jquery';

// Initialize all canvases
const $canvas = $('canvas');
$canvas
    .attr('width', $(window).width())
    .attr('height', $(window).height());

export let canvas, context;
export const setCanvas = (id) => {
    canvas = $(`canvas#${id}`);
    if(canvas.length === 1) {
        context = canvas[0].getContext('2d');
    } else {
        canvas = context = undefined;
    }
};
export default {canvas, context, setCanvas};
