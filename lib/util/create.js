var exportedObject;
if (typeof Object.create == 'function') {
  exportedObject = function(proto, props) {
    return Object.create.call(Object, proto, props);
  };
} else {
  // FIXME: anonymus is never used, it should be exportedObject
  anonymus = function(proto, props) {
    if (props)
      throw Error('Second argument is not supported!');
    if (typeof proto !== 'object' || proto === null)
      throw Error('Invalid prototype!');
    noop.prototype = proto;
    return new noop;
  };
  function noop() {
  }
}
// FIXME: rename exported object to create or default
export { exportedObject as createjs };
