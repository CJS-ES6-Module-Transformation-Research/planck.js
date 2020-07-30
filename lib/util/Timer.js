'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.now = now_now = function now_now() {
  return Date.now();
};

exports.diff = diff_diff = function diff_diff(time) {
  return Date.now() - time;
};
var now_now;
exports.now = now_now;

var diff_diff;
exports.diff = diff_diff;