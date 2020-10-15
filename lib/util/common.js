'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.debug = debug_debug = function debug_debug() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

exports.assert = assert_assert = function assert_assert(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
var assert_assert;
exports.assert = assert_assert;

var debug_debug;
exports.debug = debug_debug;