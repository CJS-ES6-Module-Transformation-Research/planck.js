'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.now = mod_now = function mod_now() {
  return Date.now();
};

exports.diff = mod_diff = function mod_diff(time) {
  return Date.now() - time;
};
var mod_now;
exports.now = mod_now;

var mod_diff;
exports.diff = mod_diff;