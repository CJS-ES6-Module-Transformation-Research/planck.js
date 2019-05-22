Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Mat22;

var _common = require("../util/common");

var common = _interopRequireWildcard(_common);

var _Math = require("./Math");

var _Math2 = _interopRequireDefault(_Math);

var _Vec = require("./Vec2");

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
 * Copyright (c) 2016-2018 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

/**
 * A 2-by-2 matrix. Stored in column-major order.
 */
function Mat22(a, b, c, d) {
  if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === 'object' && a !== null) {
    this.ex = _Vec2.default.clone(a);
    this.ey = _Vec2.default.clone(b);
  } else if (typeof a === 'number') {
    this.ex = _Vec2.default.neo(a, c);
    this.ey = _Vec2.default.neo(b, d);
  } else {
    this.ex = _Vec2.default.zero();
    this.ey = _Vec2.default.zero();
  }
}

Mat22.prototype.toString = function () {
  return JSON.stringify(this);
};

Mat22.isValid = function (o) {
  return o && _Vec2.default.isValid(o.ex) && _Vec2.default.isValid(o.ey);
};

Mat22.assert = function (o) {
  if (!_ASSERT) return;
  if (!Mat22.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Mat22!');
  }
};

Mat22.prototype.set = function (a, b, c, d) {
  if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number') {
    this.ex.set(a, c);
    this.ey.set(b, d);
  } else if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === 'object' && (typeof b === "undefined" ? "undefined" : _typeof(b)) === 'object') {
    this.ex.set(a);
    this.ey.set(b);
  } else if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === 'object') {
    _ASSERT && Mat22.assert(a);
    this.ex.set(a.ex);
    this.ey.set(a.ey);
  } else {
    _ASSERT && common.assert(false);
  }
};

Mat22.prototype.setIdentity = function () {
  this.ex.x = 1.0;
  this.ey.x = 0.0;
  this.ex.y = 0.0;
  this.ey.y = 1.0;
};

Mat22.prototype.setZero = function () {
  this.ex.x = 0.0;
  this.ey.x = 0.0;
  this.ex.y = 0.0;
  this.ey.y = 0.0;
};

Mat22.prototype.getInverse = function () {
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var imx = new Mat22();
  imx.ex.x = det * d;
  imx.ey.x = -det * b;
  imx.ex.y = -det * c;
  imx.ey.y = det * a;
  return imx;
};

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases.
 */
Mat22.prototype.solve = function (v) {
  _ASSERT && _Vec2.default.assert(v);
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var w = _Vec2.default.zero();
  w.x = det * (d * v.x - b * v.y);
  w.y = det * (a * v.y - c * v.x);
  return w;
};

/**
 * Multiply a matrix times a vector. If a rotation matrix is provided, then this
 * transforms the vector from one frame to another.
 */
Mat22.mul = function (mx, v) {
  if (v && 'x' in v && 'y' in v) {
    _ASSERT && _Vec2.default.assert(v);
    var x = mx.ex.x * v.x + mx.ey.x * v.y;
    var y = mx.ex.y * v.x + mx.ey.y * v.y;
    return _Vec2.default.neo(x, y);
  } else if (v && 'ex' in v && 'ey' in v) {
    // Mat22
    _ASSERT && Mat22.assert(v);
    return new Mat22(_Vec2.default.mul(mx, v.ex), _Vec2.default.mul(mx, v.ey));
  }

  _ASSERT && common.assert(false);
};

Mat22.mulVec2 = function (mx, v) {
  _ASSERT && _Vec2.default.assert(v);
  var x = mx.ex.x * v.x + mx.ey.x * v.y;
  var y = mx.ex.y * v.x + mx.ey.y * v.y;
  return _Vec2.default.neo(x, y);
};

Mat22.mulMat22 = function (mx, v) {
  _ASSERT && Mat22.assert(v);
  return new Mat22(_Vec2.default.mul(mx, v.ex), _Vec2.default.mul(mx, v.ey));
  _ASSERT && common.assert(false);
};

/**
 * Multiply a matrix transpose times a vector. If a rotation matrix is provided,
 * then this transforms the vector from one frame to another (inverse
 * transform).
 */
Mat22.mulT = function (mx, v) {
  if (v && 'x' in v && 'y' in v) {
    // Vec2
    _ASSERT && _Vec2.default.assert(v);
    return _Vec2.default.neo(_Vec2.default.dot(v, mx.ex), _Vec2.default.dot(v, mx.ey));
  } else if (v && 'ex' in v && 'ey' in v) {
    // Mat22
    _ASSERT && Mat22.assert(v);
    var c1 = _Vec2.default.neo(_Vec2.default.dot(mx.ex, v.ex), _Vec2.default.dot(mx.ey, v.ex));
    var c2 = _Vec2.default.neo(_Vec2.default.dot(mx.ex, v.ey), _Vec2.default.dot(mx.ey, v.ey));
    return new Mat22(c1, c2);
  }

  _ASSERT && common.assert(false);
};

Mat22.mulTVec2 = function (mx, v) {
  _ASSERT && Mat22.assert(mx);
  _ASSERT && _Vec2.default.assert(v);
  return _Vec2.default.neo(_Vec2.default.dot(v, mx.ex), _Vec2.default.dot(v, mx.ey));
};

Mat22.mulTMat22 = function (mx, v) {
  _ASSERT && Mat22.assert(mx);
  _ASSERT && Mat22.assert(v);
  var c1 = _Vec2.default.neo(_Vec2.default.dot(mx.ex, v.ex), _Vec2.default.dot(mx.ey, v.ex));
  var c2 = _Vec2.default.neo(_Vec2.default.dot(mx.ex, v.ey), _Vec2.default.dot(mx.ey, v.ey));
  return new Mat22(c1, c2);
};

Mat22.abs = function (mx) {
  _ASSERT && Mat22.assert(mx);
  return new Mat22(_Vec2.default.abs(mx.ex), _Vec2.default.abs(mx.ey));
};

Mat22.add = function (mx1, mx2) {
  _ASSERT && Mat22.assert(mx1);
  _ASSERT && Mat22.assert(mx2);
  return new Mat22(_Vec2.default.add(mx1.ex + mx2.ex), _Vec2.default.add(mx1.ey + mx2.ey));
};
module.exports = exports.default;
