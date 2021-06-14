var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

mod_now = function() {
  return Date.now();
}

mod_diff = function(time) {
  return Date.now() - time;
}
var mod_now;
export { mod_now as now };
var mod_diff;
export { mod_diff as diff };
