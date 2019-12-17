var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var expect = module.exports = _expect2.default;

expect.Assertion.prototype.list = function (obj, stringify) {
  var sfn;
  if (typeof stringify === 'function') {
    sfn = stringify;
  } else if (typeof stringify === 'string') {
    sfn = function sfn(obj) {
      var value = obj[stringify];
      return typeof value === 'function' ? value.call(obj) : value;
    };
  } else {
    sfn = function sfn(obj) {
      return expect.stringify(obj, false, 1);
    };
  }
  var match = false;
  if (obj.length === this.obj.length) {
    match = true;
    for (var i = 0; match && i < this.obj.length; i++) {
      match = this.obj[i] === obj[i] ? match : false;
    }
  }
  this.assert(match, function () {
    return 'expected ' + this.obj.map(sfn) + ' to list ' + obj.map(sfn);
  }, function () {
    return 'expected ' + this.obj.map(sfn) + ' to not list ' + obj.map(sfn);
  });
  return this;
};

expect.Assertion.prototype.near = function (obj, ep) {
  ep = ep || 1e-12;
  var diff = this.obj - obj;
  this.assert(-ep < diff && diff < ep, function () {
    return 'expected ' + this.obj + ' to be near ' + obj;
  }, function () {
    return 'expected ' + this.obj + ' not to be near ' + obj;
  });
  return this;
};

Array.prototype.pluck = function (key) {
  return this.map(function (obj) {
    return obj[key];
  });
};
