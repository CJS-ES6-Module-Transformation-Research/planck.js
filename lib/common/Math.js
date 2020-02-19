import { assert as common } from "../util/common";
import { createjs as create } from "../util/create";
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
var Math_EPSILON = 1e-9;

var Math_isFinite = function(x) {
  return typeof x === "number" && isFinite(x) && !isNaN(x);
};

var Math_assert = function(x) {
  if (!_ASSERT)
    return;
  if (!Math_isFinite(x)) {
    _DEBUG && common(x);
    throw new Error("Invalid Number!");
  }
};

var Math_invSqrt = function(x) {
  // TODO
  return 1 / native.sqrt(x);
};

var Math_nextPowerOfTwo = function(x) {
  // TODO
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  return x + 1;
};

var Math_isPowerOfTwo = function(x) {
  return x > 0 && (x & x - 1) == 0;
};

var Math_mod = function(num, min, max) {
  if (typeof min === "undefined") {
    max = 1, min = 0;
  } else if (typeof max === "undefined") {
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

var Math_clamp = function(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

var Math_random = function(min, max) {
  if (typeof min === "undefined") {
    max = 1;
    min = 0;
  } else if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  return min == max ? min : native.random() * (max - min) + min;
};

export { Math_EPSILON, Math_isFinite, Math_assert, Math_invSqrt, Math_mod, Math_clamp };
