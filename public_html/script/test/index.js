'use strict';
import '../../style/src/test.scss';

// Setup sinon-chai
import 'babel-polyfill';
import chai from 'chai';
import asPromised from 'chai-as-promised';
import sinon from 'sinon-chai';
chai.use(asPromised);
chai.use(sinon);

// Import tests
import './canvas';
import './socket';
import './draw';
import './generator';
import './util';
