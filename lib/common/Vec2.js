var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec2 = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _common = require("../util/common");

var common = _interopRequireWildcard(_common);

var _Math = require("./Math");

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

var exported_Vec2 = Vec2;
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

function Vec2(x, y) {
  if (!(this instanceof Vec2)) {
    return new Vec2(x, y);
  }
  if (typeof x === 'undefined') {
    this.x = 0;
    this.y = 0;
  } else if ((typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object') {
    this.x = x.x;
    this.y = x.y;
  } else {
    this.x = x;
    this.y = y;
  }
  _ASSERT && Vec2.assert(this);
}

Vec2.zero = function () {
  var obj = Object.create(Vec2.prototype);
  obj.x = 0;
  obj.y = 0;
  return obj;
};

Vec2.neo = function (x, y) {
  var obj = Object.create(Vec2.prototype);
  obj.x = x;
  obj.y = y;
  return obj;
};

Vec2.clone = function (v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(v.x, v.y);
};

Vec2.prototype.toString = function () {
  return JSON.stringify(this);
};

/**
 * Does this vector contain finite coordinates?
 */
Vec2.isValid = function (v) {
  return v && _Math.math.isFinite(v.x) && _Math.math.isFinite(v.y);
};

Vec2.assert = function (o) {
  if (!_ASSERT) return;
  if (!Vec2.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Vec2!');
  }
};

Vec2.prototype.clone = function () {
  return Vec2.clone(this);
};

/**
 * Set this vector to all zeros.
 * 
 * @returns this
 */
Vec2.prototype.setZero = function () {
  this.x = 0.0;
  this.y = 0.0;
  return this;
};

/**
 * Set this vector to some specified coordinates.
 * 
 * @returns this
 */
Vec2.prototype.set = function (x, y) {
  if ((typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object') {
    _ASSERT && Vec2.assert(x);
    this.x = x.x;
    this.y = x.y;
  } else {
    _ASSERT && _Math.math.assert(x);
    _ASSERT && _Math.math.assert(y);
    this.x = x;
    this.y = y;
  }
  return this;
};

/**
 * @deprecated Use setCombine or setMul
 */
Vec2.prototype.wSet = function (a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.setCombine(a, v, b, w);
  } else {
    return this.setMul(a, v);
  }
};

/**
 * Set linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.setCombine = function (a, v, b, w) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && _Math.math.assert(b);
  _ASSERT && Vec2.assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x = x;
  this.y = y;
  return this;
};

Vec2.prototype.setMul = function (a, v) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x = x;
  this.y = y;
  return this;
};

/**
 * Add a vector to this vector.
 * 
 * @returns this
 */
Vec2.prototype.add = function (w) {
  _ASSERT && Vec2.assert(w);
  this.x += w.x;
  this.y += w.y;
  return this;
};

/**
 * @deprecated Use addCombine or addMul
 */
Vec2.prototype.wAdd = function (a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.addCombine(a, v, b, w);
  } else {
    return this.addMul(a, v);
  }
};

/**
 * Add linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.addCombine = function (a, v, b, w) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && _Math.math.assert(b);
  _ASSERT && Vec2.assert(w);

  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x += x;
  this.y += y;
  return this;
};

Vec2.prototype.addMul = function (a, v) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x += x;
  this.y += y;
  return this;
};

/**
 * @deprecated Use subCombine or subMul
 */
Vec2.prototype.wSub = function (a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.subCombine(a, v, b, w);
  } else {
    return this.subMul(a, v);
  }
};

/**
 * Subtract linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.subCombine = function (a, v, b, w) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && _Math.math.assert(b);
  _ASSERT && Vec2.assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x -= x;
  this.y -= y;
  return this;
};

Vec2.prototype.subMul = function (a, v) {
  _ASSERT && _Math.math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x -= x;
  this.y -= y;
  return this;
};

/**
 * Subtract a vector from this vector
 * 
 * @returns this
 */
Vec2.prototype.sub = function (w) {
  _ASSERT && Vec2.assert(w);
  this.x -= w.x;
  this.y -= w.y;
  return this;
};

/**
 * Multiply this vector by a scalar.
 * 
 * @returns this
 */
Vec2.prototype.mul = function (m) {
  _ASSERT && _Math.math.assert(m);
  this.x *= m;
  this.y *= m;
  return this;
};

/**
 * Get the length of this vector (the norm).
 * 
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2.prototype.length = function () {
  return Vec2.lengthOf(this);
};

/**
 * Get the length squared.
 */
Vec2.prototype.lengthSquared = function () {
  return Vec2.lengthSquared(this);
};

/**
 * Convert this vector into a unit vector.
 * 
 * @returns old length
 */
Vec2.prototype.normalize = function () {
  var length = this.length();
  if (length < _Math.math.EPSILON) {
    return 0.0;
  }
  var invLength = 1.0 / length;
  this.x *= invLength;
  this.y *= invLength;
  return length;
};

/**
 * Get the length of this vector (the norm).
 *
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2.lengthOf = function (v) {
  _ASSERT && Vec2.assert(v);
  return _Math.math.sqrt(v.x * v.x + v.y * v.y);
};

/**
 * Get the length squared.
 */
Vec2.lengthSquared = function (v) {
  _ASSERT && Vec2.assert(v);
  return v.x * v.x + v.y * v.y;
};

Vec2.distance = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  var dx = v.x - w.x,
      dy = v.y - w.y;
  return _Math.math.sqrt(dx * dx + dy * dy);
};

Vec2.distanceSquared = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  var dx = v.x - w.x,
      dy = v.y - w.y;
  return dx * dx + dy * dy;
};

Vec2.areEqual = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return v == w || (typeof w === "undefined" ? "undefined" : _typeof(w)) === 'object' && w !== null && v.x === w.x && v.y === w.y;
};

/**
 * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
 */
Vec2.skew = function (v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(-v.y, v.x);
};

/**
 * Perform the dot product on two vectors.
 */
Vec2.dot = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return v.x * w.x + v.y * w.y;
};

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 * 
 * Perform the cross product on a vector and a scalar. In 2D this produces a
 * vector.
 */
Vec2.cross = function (v, w) {
  if (typeof w === 'number') {
    _ASSERT && Vec2.assert(v);
    _ASSERT && _Math.math.assert(w);
    return Vec2.neo(w * v.y, -w * v.x);
  } else if (typeof v === 'number') {
    _ASSERT && _Math.math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y, v * w.x);
  } else {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v.x * w.y - v.y * w.x;
  }
};

/**
 * Returns `a + (v x w)`
 */
Vec2.addCross = function (a, v, w) {
  if (typeof w === 'number') {
    _ASSERT && Vec2.assert(v);
    _ASSERT && _Math.math.assert(w);
    return Vec2.neo(w * v.y + a.x, -w * v.x + a.y);
  } else if (typeof v === 'number') {
    _ASSERT && _Math.math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y + a.x, v * w.x + a.y);
  }

  _ASSERT && common.assert(false);
};

Vec2.add = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(v.x + w.x, v.y + w.y);
};

/**
 * @deprecated Use combine
 */
Vec2.wAdd = function (a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return Vec2.combine(a, v, b, w);
  } else {
    return Vec2.mul(a, v);
  }
};

Vec2.combine = function (a, v, b, w) {
  return Vec2.zero().setCombine(a, v, b, w);
};

Vec2.sub = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(v.x - w.x, v.y - w.y);
};

Vec2.mul = function (a, b) {
  if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === 'object') {
    _ASSERT && Vec2.assert(a);
    _ASSERT && _Math.math.assert(b);
    return Vec2.neo(a.x * b, a.y * b);
  } else if ((typeof b === "undefined" ? "undefined" : _typeof(b)) === 'object') {
    _ASSERT && _Math.math.assert(a);
    _ASSERT && Vec2.assert(b);
    return Vec2.neo(a * b.x, a * b.y);
  }
};

Vec2.prototype.neg = function () {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

Vec2.neg = function (v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(-v.x, -v.y);
};

Vec2.abs = function (v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(_Math.math.abs(v.x), _Math.math.abs(v.y));
};

Vec2.mid = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
};

Vec2.upper = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(_Math.math.max(v.x, w.x), _Math.math.max(v.y, w.y));
};

Vec2.lower = function (v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(_Math.math.min(v.x, w.x), _Math.math.min(v.y, w.y));
};

Vec2.prototype.clamp = function (max) {
  var lengthSqr = this.x * this.x + this.y * this.y;
  if (lengthSqr > max * max) {
    var invLength = _Math.math.invSqrt(lengthSqr);
    this.x *= invLength * max;
    this.y *= invLength * max;
  }
  return this;
};

Vec2.clamp = function (v, max) {
  v = Vec2.neo(v.x, v.y);
  v.clamp(max);
  return v;
};

/**
 * @experimental
 */
Vec2.scaleFn = function (x, y) {
  return function (v) {
    return Vec2.neo(v.x * x, v.y * y);
  };
};

/**
 * @experimental
 */
Vec2.translateFn = function (x, y) {
  return function (v) {
    return Vec2.neo(v.x + x, v.y + y);
  };
};
exports.Vec2 = exported_Vec2;
