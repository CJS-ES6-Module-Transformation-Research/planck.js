var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

debug_debug = function() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

assert_assert = function(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
var assert_assert;
export { assert_assert as assert };
var debug_debug;
export { debug_debug as debug };