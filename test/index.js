'use strict';

// Setup sinon-chai
import 'babel-polyfill';
import chai from 'chai';
import asPromised from 'chai-as-promised';
import sinon from 'sinon-chai';
chai.use(sinon);
chai.use(asPromised);

// Import tests
import './generator';
import './database';

import './login';