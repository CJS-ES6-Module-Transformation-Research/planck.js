import { debug as Vec2_debug } from "../util/common";
import { assert as Vec2_assert } from "../util/common";

import {
  EPSILON as Mathjs_EPSILON,
  isFinite as Mathjs_isFinite,
  assert as Mathjs_assert,
  invSqrt as Mathjs_invSqrt,
} from "./Math";

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
  } else if (typeof x === 'object') {
    this.x = x.x;
    this.y = x.y;
  } else {
    this.x = x;
    this.y = y;
  }
  _ASSERT && Vec2_assert(this);
}

Vec2_zero = function() {
  var obj = Object.create(Vec2.prototype);
  obj.x = 0;
  obj.y = 0;
  return obj;
};;

Vec2_neo = function(x, y) {
  var obj = Object.create(Vec2.prototype);
  obj.x = x;
  obj.y = y;
  return obj;
};;

Vec2_clone = function(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(v.x, v.y);
};;

Vec2.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * Does this vector contain finite coordinates?
 */
Vec2_isValid = function(v) {
  return v && Mathjs_isFinite(v.x) && Mathjs_isFinite(v.y);
};;

Vec2_assert = function(o) {
  if (!_ASSERT)
    return;
  if (!Vec2_isValid(o)) {
    _DEBUG && Vec2_debug(o);
    throw new Error("Invalid Vec2!");
  }
};;

Vec2.prototype.clone = function() {
  return Vec2_clone(this);
}

/**
 * Set this vector to all zeros.
 * 
 * @returns this
 */
Vec2.prototype.setZero = function() {
  this.x = 0.0;
  this.y = 0.0;
  return this;
}

/**
 * Set this vector to some specified coordinates.
 * 
 * @returns this
 */
Vec2.prototype.set = function(x, y) {
  if (typeof x === 'object') {
    _ASSERT && Vec2_assert(x);
    this.x = x.x;
    this.y = x.y;
  } else {
    _ASSERT && Mathjs_assert(x);
    _ASSERT && Mathjs_assert(y);
    this.x = x;
    this.y = y;
  }
  return this;
}

/**
 * @deprecated Use setCombine or setMul
 */
Vec2.prototype.wSet = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.setCombine(a, v, b, w);
  } else {
    return this.setMul(a, v);
  }
}

/**
 * Set linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.setCombine = function(a, v, b, w) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && Mathjs_assert(b);
  _ASSERT && Vec2_assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x = x;
  this.y = y;
  return this;
}

Vec2.prototype.setMul = function(a, v) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x = x;
  this.y = y;
  return this;
}

/**
 * Add a vector to this vector.
 * 
 * @returns this
 */
Vec2.prototype.add = function(w) {
  _ASSERT && Vec2_assert(w);
  this.x += w.x;
  this.y += w.y;
  return this;
}

/**
 * @deprecated Use addCombine or addMul
 */
Vec2.prototype.wAdd = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.addCombine(a, v, b, w);
  } else {
    return this.addMul(a, v);
  }
}

/**
 * Add linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.addCombine = function(a, v, b, w) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && Mathjs_assert(b);
  _ASSERT && Vec2_assert(w);

  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x += x;
  this.y += y;
  return this;
}

Vec2.prototype.addMul = function(a, v) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x += x;
  this.y += y;
  return this;
}

/**
 * @deprecated Use subCombine or subMul
 */
Vec2.prototype.wSub = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.subCombine(a, v, b, w);
  } else {
    return this.subMul(a, v);
  }}

/**
 * Subtract linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.subCombine = function(a, v, b, w) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  _ASSERT && Mathjs_assert(b);
  _ASSERT && Vec2_assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x -= x;
  this.y -= y;
  return this;
}

Vec2.prototype.subMul = function(a, v) {
  _ASSERT && Mathjs_assert(a);
  _ASSERT && Vec2_assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x -= x;
  this.y -= y;
  return this;
}

/**
 * Subtract a vector from this vector
 * 
 * @returns this
 */
Vec2.prototype.sub = function(w) {
  _ASSERT && Vec2_assert(w);
  this.x -= w.x;
  this.y -= w.y;
  return this;
}

/**
 * Multiply this vector by a scalar.
 * 
 * @returns this
 */
Vec2.prototype.mul = function(m) {
  _ASSERT && Mathjs_assert(m);
  this.x *= m;
  this.y *= m;
  return this;
}

/**
 * Get the length of this vector (the norm).
 * 
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2.prototype.length = function() {
  return Vec2_lengthOf(this);
}

/**
 * Get the length squared.
 */
Vec2.prototype.lengthSquared = function() {
  return Vec2_lengthSquared(this);
}

/**
 * Convert this vector into a unit vector.
 * 
 * @returns old length
 */
Vec2.prototype.normalize = function() {
  var length = this.length();
  if (length < Mathjs_EPSILON) {
    return 0.0;
  }
  var invLength = 1.0 / length;
  this.x *= invLength;
  this.y *= invLength;
  return length;
}

/**
 * Get the length of this vector (the norm).
 *
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2_lengthOf = function(v) {
  _ASSERT && Vec2_assert(v);
  return Math.sqrt(v.x * v.x + v.y * v.y);
};;

/**
 * Get the length squared.
 */
Vec2_lengthSquared = function(v) {
  _ASSERT && Vec2_assert(v);
  return v.x * v.x + v.y * v.y;
};;

Vec2_distance = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  var dx = v.x - w.x, dy = v.y - w.y;
  return Math.sqrt(dx * dx + dy * dy);
};;

Vec2_distanceSquared = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  var dx = v.x - w.x, dy = v.y - w.y;
  return dx * dx + dy * dy;
};;

Vec2_areEqual = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return v == w || typeof w === "object" && w !== null && v.x === w.x && v.y === w.y;
};;

/**
 * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
 */
Vec2_skew = function(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(-v.y, v.x);
};;

/**
 * Perform the dot product on two vectors.
 */
Vec2_dot = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return v.x * w.x + v.y * w.y;
};;

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 * 
 * Perform the cross product on a vector and a scalar. In 2D this produces a
 * vector.
 */
Vec2_cross = function(v, w) {
  if (typeof w === "number") {
    _ASSERT && Vec2_assert(v);
    _ASSERT && Mathjs_assert(w);
    return Vec2_neo(w * v.y, -w * v.x);
  } else if (typeof v === "number") {
    _ASSERT && Mathjs_assert(v);
    _ASSERT && Vec2_assert(w);
    return Vec2_neo(-v * w.y, v * w.x);
  } else {
    _ASSERT && Vec2_assert(v);
    _ASSERT && Vec2_assert(w);
    return v.x * w.y - v.y * w.x;
  }
};;

/**
 * Returns `a + (v x w)`
 */
Vec2_addCross = function(a, v, w) {
  if (typeof w === "number") {
    _ASSERT && Vec2_assert(v);
    _ASSERT && Mathjs_assert(w);
    return Vec2_neo(w * v.y + a.x, -w * v.x + a.y);
  } else if (typeof v === "number") {
    _ASSERT && Mathjs_assert(v);
    _ASSERT && Vec2_assert(w);
    return Vec2_neo(-v * w.y + a.x, v * w.x + a.y);
  }

  _ASSERT && Vec2_assert(false);
};;

Vec2_add = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(v.x + w.x, v.y + w.y);
};;

/**
 * @deprecated Use combine
 */
Vec2_wAdd = function(a, v, b, w) {
  if (typeof b !== "undefined" || typeof w !== "undefined") {
    return Vec2_combine(a, v, b, w);
  } else {
    return Vec2_mul(a, v);
  }
};;

Vec2_combine = function(a, v, b, w) {
  return Vec2_zero().setCombine(a, v, b, w);
};;

Vec2_sub = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(v.x - w.x, v.y - w.y);
};;

Vec2_mul = function(a, b) {
  if (typeof a === "object") {
    _ASSERT && Vec2_assert(a);
    _ASSERT && Mathjs_assert(b);
    return Vec2_neo(a.x * b, a.y * b);
  } else if (typeof b === "object") {
    _ASSERT && Mathjs_assert(a);
    _ASSERT && Vec2_assert(b);
    return Vec2_neo(a * b.x, a * b.y);
  }
};;

Vec2.prototype.neg = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
}

Vec2_neg = function(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(-v.x, -v.y);
};;

Vec2_abs = function(v) {
  _ASSERT && Vec2_assert(v);
  return Vec2_neo(Math.abs(v.x), Math.abs(v.y));
};;

Vec2_mid = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
};;

Vec2_upper = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(Math.max(v.x, w.x), Math.max(v.y, w.y));
};;

Vec2_lower = function(v, w) {
  _ASSERT && Vec2_assert(v);
  _ASSERT && Vec2_assert(w);
  return Vec2_neo(Math.min(v.x, w.x), Math.min(v.y, w.y));
};;

Vec2.prototype.clamp = function(max) {
  var lengthSqr = this.x * this.x + this.y * this.y;
  if (lengthSqr > max * max) {
    var invLength = Mathjs_invSqrt(lengthSqr);
    this.x *= invLength * max;
    this.y *= invLength * max;
  }
  return this;
}

Vec2_clamp = function(v, max) {
  v = Vec2_neo(v.x, v.y);
  v.clamp(max);
  return v;
};;

/**
 * @experimental
 */
Vec2_scaleFn = function(x, y) {
  return function(v) {
    return Vec2_neo(v.x * x, v.y * y);
  };
};;

/**
 * @experimental
 */
Vec2_translateFn = function(x, y) {
  return function(v) {
    return Vec2_neo(v.x + x, v.y + y);
  };
};;
export { Vec2_zero as zero, Vec2_neo as neo, Vec2_clone as clone, Vec2_isValid as isValid, Vec2_assert as assert, Vec2_lengthSquared as lengthSquared, Vec2_distance as distance, Vec2_distanceSquared as distanceSquared, Vec2_areEqual as areEqual, Vec2_skew as skew, Vec2_dot as dot, Vec2_cross as cross, Vec2_addCross as addCross, Vec2_add as add, Vec2_combine as combine, Vec2_sub as sub, Vec2_mul as mul, Vec2_neg as neg, Vec2_abs as abs, Vec2_mid as mid, Vec2_clamp as clamp };
var exported_Vec2 = Vec2;
export { exported_Vec2 as Vec2 };
