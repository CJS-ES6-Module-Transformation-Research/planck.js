var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var debug_debug;

debug_debug = function() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

var assert_assert;

assert_assert = function(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
export { debug_debug as debug };
export { assert_assert as assert };