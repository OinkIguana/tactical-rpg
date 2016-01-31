'use strict';

// Setup sinon-chai
import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
chai.use(chaiAsPromised);

// Import tests
import './generator';
import './database';
import './user';

import './query';
import './login';
import './main-menu';
