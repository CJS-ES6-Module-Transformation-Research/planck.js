var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var now_now;

now_now = function() {
  return Date.now();
}

var diff_diff;

diff_diff = function(time) {
  return Date.now() - time;
}
export { now_now as now };
export { diff_diff as diff };
