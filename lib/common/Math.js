"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = exports.mod = exports.invSqrt = exports.assert = exports.isFinite = exports.EPSILON = exports.math = undefined;

var _common = require("../util/common");

var _create = require("../util/create");

var mod_math = {};
var random;
var clamp;
var mod;
var isPowerOfTwo;
var nextPowerOfTwo;
var invSqrt;
var assert;
var Math_isFinite;
var EPSILON;

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

var native = Math;
var math = exports.math = mod_math = (0, _create.create)(native);

exports.EPSILON = EPSILON = 1e-9; // TODO

/**
 * This function is used to ensure that a floating point number is not a NaN or
 * infinity.
 */
exports.isFinite = Math_isFinite = function Math_isFinite(x) {
  return typeof x === 'number' && isFinite(x) && !isNaN(x);
};

exports.assert = assert = function assert(x) {
  if (!_ASSERT) return;
  if (!Math_isFinite(x)) {
    _DEBUG && (0, _common.debug)(x);
    throw new Error('Invalid Number!');
  }
};

/**
 * TODO: This is a approximate yet fast inverse square-root.
 */
exports.invSqrt = invSqrt = function invSqrt(x) {
  // TODO
  return 1 / native.sqrt(x);
};

/**
 * Next Largest Power of 2 Given a binary integer value x, the next largest
 * power of 2 can be computed by a SWAR algorithm that recursively "folds" the
 * upper bits into the lower bits. This process yields a bit vector with the
 * same most significant 1 as x, but all 1's below it. Adding 1 to that value
 * yields the next largest power of 2. For a 32-bit value:
 */
nextPowerOfTwo = function nextPowerOfTwo(x) {
  // TODO
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  return x + 1;
};

isPowerOfTwo = function isPowerOfTwo(x) {
  return x > 0 && (x & x - 1) == 0;
};

exports.mod = mod = function mod(num, min, max) {
  if (typeof min === 'undefined') {
    max = 1, min = 0;
  } else if (typeof max === 'undefined') {
    max = min, min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};

exports.clamp = clamp = function clamp(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

random = function random(min, max) {
  if (typeof min === 'undefined') {
    max = 1;
    min = 0;
  } else if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }
  return min == max ? min : native.random() * (max - min) + min;
};
exports.math = mod_math;
exports.EPSILON = EPSILON;
exports.isFinite = Math_isFinite;
exports.assert = assert;
exports.invSqrt = invSqrt;
exports.mod = mod;
exports.clamp = clamp;