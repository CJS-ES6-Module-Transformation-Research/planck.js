var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

export { now };;

var now = function() {
  return Date.now();
};

export { diff };;

var diff = function(time) {
  return Date.now() - time;
};
