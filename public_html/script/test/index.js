'use strict';
import '../../style/src/test.scss';

// Setup sinon-chai
import 'babel-polyfill';
import chai from 'chai';
import sinon from 'sinon-chai';
chai.use(sinon);

// Import tests
import './canvas.js';
import './draw.js';
import './generator.js';
import './util.js';
