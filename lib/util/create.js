var mod_anonymus;
if (typeof Object.create == 'function') {
  mod_anonymus = function(proto, props) {
    return Object.create.call(Object, proto, props);
  };
} else {
  mod_anonymus = function(proto, props) {
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
export { mod_anonymus as create };
