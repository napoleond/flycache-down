'use strict';

require('es5-shim');

var tape   = require('tape');
var flycache = require('../');
var testCommon = require('./testCommon');
var testBuffer = new Buffer('hello');

require('abstract-leveldown/abstract/leveldown-test').args(flycache, tape);
require('abstract-leveldown/abstract/open-test').args(flycache, tape, testCommon);
require('abstract-leveldown/abstract/del-test').all(flycache, tape, testCommon);
require('abstract-leveldown/abstract/put-test').all(flycache, tape, testCommon);
require('abstract-leveldown/abstract/get-test').all(flycache, tape, testCommon);
require('abstract-leveldown/abstract/put-get-del-test').all(
  flycache, tape, testCommon, testBuffer);
require('abstract-leveldown/abstract/close-test').close(flycache, tape, testCommon);
require('abstract-leveldown/abstract/iterator-test').all(flycache, tape, testCommon);

require('abstract-leveldown/abstract/chained-batch-test').all(flycache, tape, testCommon);
require('abstract-leveldown/abstract/approximate-size-test').setUp(flycache, tape, testCommon);
require('abstract-leveldown/abstract/approximate-size-test').args(flycache, tape, testCommon);

require('abstract-leveldown/abstract/ranges-test').all(flycache, tape, testCommon);
require('abstract-leveldown/abstract/batch-test').all(flycache, tape, testCommon);

require('./custom-tests.js').all(flycache, tape, testCommon);

