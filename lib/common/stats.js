var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

toString_toString = function(newline) {
  newline = typeof newline === 'string' ? newline : '\n';
  var string = "";
  for (var name in this) {
    if (typeof this[name] !== 'function' && typeof this[name] !== 'object') {
      string += name + ': ' + this[name] + newline;
    }
  }
  return string;
};
var toString_toString;
export { toString_toString as toString };