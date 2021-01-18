var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

mod_debug = function() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

mod_assert = function(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};
var mod_assert;
export { mod_assert as assert };
var mod_debug;
export { mod_debug as debug };