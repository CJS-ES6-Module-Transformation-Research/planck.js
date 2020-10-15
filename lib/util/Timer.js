var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

now_now = function() {
  return Date.now();
}

diff_diff = function(time) {
  return Date.now() - time;
}
var now_now;
export { now_now as now };
var diff_diff;
export { diff_diff as diff };
