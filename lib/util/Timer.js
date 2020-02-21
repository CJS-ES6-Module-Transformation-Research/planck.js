var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var now = function() {
  return Date.now();
};

export { now };;

var diff = function(time) {
  return Date.now() - time;
};

export { diff };;
