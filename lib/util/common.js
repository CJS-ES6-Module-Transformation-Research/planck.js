'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var debug = function debug() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

exports.debug = debug;
;

var assert = function assert(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};

exports.assert = assert;
;