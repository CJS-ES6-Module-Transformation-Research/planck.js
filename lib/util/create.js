var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var exportedObject;
if (typeof Object.create == 'function') {
  exports.createjs = exportedObject = function exportedObject(proto, props) {
    return Object.create.call(Object, proto, props);
  };
} else {
  var noop = function noop() {};

  anonymus = function anonymus(proto, props) {
    if (props) throw Error('Second argument is not supported!');
    if ((typeof proto === 'undefined' ? 'undefined' : _typeof(proto)) !== 'object' || proto === null) throw Error('Invalid prototype!');
    noop.prototype = proto;
    return new noop();
  };
}
exports.createjs = exportedObject;
