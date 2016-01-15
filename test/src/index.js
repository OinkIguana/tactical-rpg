'use strict';

// Setup sinon-chai
import 'babel-polyfill';
import chai from 'chai';
import sinon from 'sinon-chai';
chai.use(sinon);

// Import tests
import './canvas.js';
import './draw.js';
import './util.js';
