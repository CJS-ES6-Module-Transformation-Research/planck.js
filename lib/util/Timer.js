Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.now = now;
;

var now = function now() {
  return Date.now();
};

exports.diff = diff;
;

var diff = function diff(time) {
  return Date.now() - time;
};
