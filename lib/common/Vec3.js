"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vec3 = exports.neg = exports.sub = exports.add = exports.cross = exports.dot = exports.assert = exports.isValid = exports.clone = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _common = require("../util/common");

var _Math = require("./Math");

var Vec3_neg;
var Vec3_mul;
var Vec3_sub;
var Vec3_add;
var Vec3_cross;
var Vec3_dot;
var Vec3_areEqual;
var Vec3_assert;
var Vec3_isValid;
var Vec3_clone;
var Vec3_neo;
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

function Vec3(x, y, z) {
  if (!(this instanceof Vec3)) {
    return new Vec3(x, y, z);
  }
  if (typeof x === 'undefined') {
    this.x = 0, this.y = 0, this.z = 0;
  } else if ((typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object') {
    this.x = x.x, this.y = x.y, this.z = x.z;
  } else {
    this.x = x, this.y = y, this.z = z;
  }
  _ASSERT && Vec3_assert(this);
}

Vec3_neo = function Vec3_neo(x, y, z) {
  var obj = Object.create(Vec3.prototype);
  obj.x = x;
  obj.y = y;
  obj.z = z;
  return obj;
};

exports.clone = Vec3_clone = function Vec3_clone(v) {
  _ASSERT && Vec3_assert(v);
  return Vec3_neo(v.x, v.y, v.z);
};

Vec3.prototype.toString = function () {
  return JSON.stringify(this);
};

/**
 * Does this vector contain finite coordinates?
 */
exports.isValid = Vec3_isValid = function Vec3_isValid(v) {
  return v && (0, _Math.isFinite)(v.x) && (0, _Math.isFinite)(v.y) && (0, _Math.isFinite)(v.z);
};

exports.assert = Vec3_assert = function Vec3_assert(o) {
  if (!_ASSERT) return;
  if (!Vec3_isValid(o)) {
    _DEBUG && (0, _common.debug)(o);
    throw new Error('Invalid Vec3!');
  }
};

Vec3.prototype.setZero = function () {
  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  return this;
};

Vec3.prototype.set = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

Vec3.prototype.add = function (w) {
  this.x += w.x;
  this.y += w.y;
  this.z += w.z;
  return this;
};

Vec3.prototype.sub = function (w) {
  this.x -= w.x;
  this.y -= w.y;
  this.z -= w.z;
  return this;
};

Vec3.prototype.mul = function (m) {
  this.x *= m;
  this.y *= m;
  this.z *= m;
  return this;
};

Vec3_areEqual = function Vec3_areEqual(v, w) {
  _ASSERT && Vec3_assert(v);
  _ASSERT && Vec3_assert(w);
  return v == w || (typeof v === "undefined" ? "undefined" : _typeof(v)) === 'object' && v !== null && (typeof w === "undefined" ? "undefined" : _typeof(w)) === 'object' && w !== null && v.x === w.x && v.y === w.y && v.z === w.z;
};

/**
 * Perform the dot product on two vectors.
 */
exports.dot = Vec3_dot = function Vec3_dot(v, w) {
  return v.x * w.x + v.y * w.y + v.z * w.z;
};

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 */
exports.cross = Vec3_cross = function Vec3_cross(v, w) {
  return new Vec3(v.y * w.z - v.z * w.y, v.z * w.x - v.x * w.z, v.x * w.y - v.y * w.x);
};

exports.add = Vec3_add = function Vec3_add(v, w) {
  return new Vec3(v.x + w.x, v.y + w.y, v.z + w.z);
};

exports.sub = Vec3_sub = function Vec3_sub(v, w) {
  return new Vec3(v.x - w.x, v.y - w.y, v.z - w.z);
};

Vec3_mul = function Vec3_mul(v, m) {
  return new Vec3(m * v.x, m * v.y, m * v.z);
};

Vec3.prototype.neg = function () {
  this.x = -this.x;
  this.y = -this.y;
  this.z = -this.z;
  return this;
};

exports.neg = Vec3_neg = function Vec3_neg(v) {
  return new Vec3(-v.x, -v.y, -v.z);
};
exports.clone = Vec3_clone;
exports.isValid = Vec3_isValid;
exports.assert = Vec3_assert;
exports.dot = Vec3_dot;
exports.cross = Vec3_cross;
exports.add = Vec3_add;
exports.sub = Vec3_sub;
exports.neg = Vec3_neg;
exports.Vec3 = Vec3;