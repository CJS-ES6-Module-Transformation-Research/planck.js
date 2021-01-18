'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.debug = mod_debug = function mod_debug() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

exports.assert = mod_assert = function mod_assert(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
var mod_assert;
exports.assert = mod_assert;

var mod_debug;
exports.debug = mod_debug;