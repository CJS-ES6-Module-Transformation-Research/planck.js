'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var now = function now() {
  return Date.now();
};

exports.now = now;
;

var diff = function diff(time) {
  return Date.now() - time;
};

exports.diff = diff;
;