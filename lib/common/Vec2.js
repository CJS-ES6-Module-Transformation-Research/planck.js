var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec2 = exports.Vec2_clamp = exports.Vec2_mid = exports.Vec2_abs = exports.Vec2_neg = exports.Vec2_mul = exports.Vec2_sub = exports.Vec2_combine = exports.Vec2_add = exports.Vec2_addCross = exports.Vec2_cross = exports.Vec2_dot = exports.Vec2_skew = exports.Vec2_areEqual = exports.Vec2_distanceSquared = exports.Vec2_distance = exports.Vec2_lengthSquared = exports.Vec2_assert = exports.Vec2_isValid = exports.Vec2_clone = exports.Vec2_neo = exports.Vec2_zero = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _common = require("../util/common");

var _Math = require("./Math");

var Vec2_translateFn;
var Vec2_scaleFn;
var Vec2_clamp;
var Vec2_lower;
var Vec2_upper;
var Vec2_mid;
var Vec2_abs;
var Vec2_neg;
var Vec2_mul;
var Vec2_sub;
var Vec2_combine;
var Vec2_wAdd;
var Vec2_add;
var Vec2_addCross;
var Vec2_cross;
var Vec2_dot;
var Vec2_skew;
var Vec2_areEqual;
var Vec2_distanceSquared;
var Vec2_distance;
var Vec2_lengthSquared;
var Vec2_lengthOf;
var Vec2_assert;
var Vec2_isValid;
var Vec2_clone;
var Vec2_neo;
var Vec2_zero;
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
  _ASSERT && Vec2_assert(this);
}

exports.Vec2_zero = Vec2_zero = function Vec2_zero() {
  var obj = Object.create(Vec2.prototype);
  obj.x = 0;
  obj.y = 0;
  return obj;
};

exports.Vec2_neo = Vec2_neo = function Vec2_neo(x, y) {
  var obj = Object.create(Vec2.prototype);
  obj.x = x;
  obj.y = y;
  return obj;
};

exports.Vec2_clone = Vec2_clone = function Vec2_clone(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(v.x, v.y);
};

Vec2.prototype.toString = function () {
  return JSON.stringify(this);
};

exports.Vec2_isValid = Vec2_isValid = function Vec2_isValid(v) {
  return v && (0, _Math.isFinite)(v.x) && (0, _Math.isFinite)(v.y);
};

exports.Vec2_assert = Vec2_assert = function Vec2_assert(o) {
  if (!_ASSERT) return;
  if (!Vec2_isValid(o)) {
    _DEBUG && _common.assert.debug(o);
    throw new Error("Invalid Vec2!");
  }
};

Vec2.prototype.clone = function () {
  return Vec2_clone(this);
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
    _ASSERT && Vec2_assert(x);
    this.x = x.x;
    this.y = x.y;
  } else {
    _ASSERT && (0, _Math.assert)(x);
    _ASSERT && (0, _Math.assert)(y);
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
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && (0, _Math.assert)(b);
  _ASSERT && Vec2_assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x = x;
  this.y = y;
  return this;
};

Vec2.prototype.setMul = function (a, v) {
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
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
  _ASSERT && Vec2_assert(w);
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
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && (0, _Math.assert)(b);
  _ASSERT && Vec2_assert(w);

  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x += x;
  this.y += y;
  return this;
};

Vec2.prototype.addMul = function (a, v) {
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
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
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && (0, _Math.assert)(b);
  _ASSERT && Vec2_assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x -= x;
  this.y -= y;
  return this;
};

Vec2.prototype.subMul = function (a, v) {
  _ASSERT && (0, _Math.assert)(a);
  _ASSERT && Vec2_assert(v);
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
  _ASSERT && Vec2_assert(w);
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
  _ASSERT && (0, _Math.assert)(m);
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
  return Vec2_lengthOf(this);
};

/**
 * Get the length squared.
 */
Vec2.prototype.lengthSquared = function () {
  return Vec2_lengthSquared(this);
};

/**
 * Convert this vector into a unit vector.
 * 
 * @returns old length
 */
Vec2.prototype.normalize = function () {
  var length = this.length();
  if (length < _Math.EPSILON) {
    return 0.0;
  }
  var invLength = 1.0 / length;
  this.x *= invLength;
  this.y *= invLength;
  return length;
};

Vec2_lengthOf = function Vec2_lengthOf(v) {
  _ASSERT && Vec2_assert(v);
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

exports.Vec2_lengthSquared = Vec2_lengthSquared = function Vec2_lengthSquared(v) {
  _ASSERT && Vec2_assert(v);
  return v.x * v.x + v.y * v.y;
};

exports.Vec2_distance = Vec2_distance = function Vec2_distance(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  var dx = v.x - w.x,
      dy = v.y - w.y;
  return Math.sqrt(dx * dx + dy * dy);
};

exports.Vec2_distanceSquared = Vec2_distanceSquared = function Vec2_distanceSquared(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  var dx = v.x - w.x,
      dy = v.y - w.y;
  return dx * dx + dy * dy;
};

exports.Vec2_areEqual = Vec2_areEqual = function Vec2_areEqual(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return v == w || (typeof w === "undefined" ? "undefined" : _typeof(w)) === "object" && w !== null && v.x === w.x && v.y === w.y;
};

exports.Vec2_skew = Vec2_skew = function Vec2_skew(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(-v.y, v.x);
};

exports.Vec2_dot = Vec2_dot = function Vec2_dot(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return v.x * w.x + v.y * w.y;
};

exports.Vec2_cross = Vec2_cross = function Vec2_cross(v, w) {
  if (typeof w === "number") {
    _ASSERT && Vec2_assert(v);
    _ASSERT && (0, _Math.assert)(w);
    return Vec2_neo(w * v.y, -w * v.x);
  } else if (typeof v === "number") {
    _ASSERT && (0, _Math.assert)(v);
    _ASSERT && Vec2_assert(w);
    return Vec2_neo(-v * w.y, v * w.x);
  } else {
    _ASSERT && Vec2_assert(v);
    _ASSERT && Vec2_assert(w);
    return v.x * w.y - v.y * w.x;
  }
};

exports.Vec2_addCross = Vec2_addCross = function Vec2_addCross(a, v, w) {
  if (typeof w === "number") {
    _ASSERT && Vec2_assert(v);
    _ASSERT && (0, _Math.assert)(w);
    return Vec2_neo(w * v.y + a.x, -w * v.x + a.y);
  } else if (typeof v === "number") {
    _ASSERT && (0, _Math.assert)(v);
    _ASSERT && Vec2_assert(w);
    return Vec2_neo(-v * w.y + a.x, v * w.x + a.y);
  }

  _ASSERT && _common.assert.assert(false);
};

exports.Vec2_add = Vec2_add = function Vec2_add(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(v.x + w.x, v.y + w.y);
};

Vec2_wAdd = function Vec2_wAdd(a, v, b, w) {
  if (typeof b !== "undefined" || typeof w !== "undefined") {
    return Vec2_combine(a, v, b, w);
  } else {
    return Vec2_mul(a, v);
  }
};

exports.Vec2_combine = Vec2_combine = function Vec2_combine(a, v, b, w) {
  return Vec2_zero().setCombine(a, v, b, w);
};

exports.Vec2_sub = Vec2_sub = function Vec2_sub(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(v.x - w.x, v.y - w.y);
};

exports.Vec2_mul = Vec2_mul = function Vec2_mul(a, b) {
  if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === "object") {
    _ASSERT && Vec2_assert(a);
    _ASSERT && (0, _Math.assert)(b);
    return Vec2_neo(a.x * b, a.y * b);
  } else if ((typeof b === "undefined" ? "undefined" : _typeof(b)) === "object") {
    _ASSERT && (0, _Math.assert)(a);
    _ASSERT && Vec2_assert(b);
    return Vec2_neo(a * b.x, a * b.y);
  }
};

Vec2.prototype.neg = function () {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

exports.Vec2_neg = Vec2_neg = function Vec2_neg(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(-v.x, -v.y);
};

exports.Vec2_abs = Vec2_abs = function Vec2_abs(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(Math.abs(v.x), Math.abs(v.y));
};

exports.Vec2_mid = Vec2_mid = function Vec2_mid(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
};

Vec2_upper = function Vec2_upper(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(Math.max(v.x, w.x), Math.max(v.y, w.y));
};

Vec2_lower = function Vec2_lower(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(Math.min(v.x, w.x), Math.min(v.y, w.y));
};

Vec2.prototype.clamp = function (max) {
  var lengthSqr = this.x * this.x + this.y * this.y;
  if (lengthSqr > max * max) {
    var invLength = (0, _Math.invSqrt)(lengthSqr);
    this.x *= invLength * max;
    this.y *= invLength * max;
  }
  return this;
};

exports.Vec2_clamp = Vec2_clamp = function Vec2_clamp(v, max) {
  v = Vec2_neo(v.x, v.y);
  v.clamp(max);
  return v;
};

Vec2_scaleFn = function Vec2_scaleFn(x, y) {
  return function (v) {
    return Vec2_neo(v.x * x, v.y * y);
  };
};

Vec2_translateFn = function Vec2_translateFn(x, y) {
  return function (v) {
    return Vec2_neo(v.x + x, v.y + y);
  };
};

exports.Vec2_zero = Vec2_zero;
exports.Vec2_neo = Vec2_neo;
exports.Vec2_clone = Vec2_clone;
exports.Vec2_isValid = Vec2_isValid;
exports.Vec2_assert = Vec2_assert;
exports.Vec2_lengthSquared = Vec2_lengthSquared;
exports.Vec2_distance = Vec2_distance;
exports.Vec2_distanceSquared = Vec2_distanceSquared;
exports.Vec2_areEqual = Vec2_areEqual;
exports.Vec2_skew = Vec2_skew;
exports.Vec2_dot = Vec2_dot;
exports.Vec2_cross = Vec2_cross;
exports.Vec2_addCross = Vec2_addCross;
exports.Vec2_add = Vec2_add;
exports.Vec2_combine = Vec2_combine;
exports.Vec2_sub = Vec2_sub;
exports.Vec2_mul = Vec2_mul;
exports.Vec2_neg = Vec2_neg;
exports.Vec2_abs = Vec2_abs;
exports.Vec2_mid = Vec2_mid;
exports.Vec2_clamp = Vec2_clamp;

var exported_Vec2 = Vec2;
exports.Vec2 = exported_Vec2;
