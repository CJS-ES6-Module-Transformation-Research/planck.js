Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var now = exports.now = function now() {
  return Date.now();
};;

var diff = exports.diff = function diff(time) {
  return Date.now() - time;
};;
