var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AABB = exports.areEqual = exports.testOverlap = exports.extend = exports.isValid = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _Math = require("../common/Math");

var _Vec = require("../common/Vec2");

var AABB_diff;
var AABB_areEqual;
var AABB_testOverlap;
var AABB_extend;
var AABB_assert;
var AABB_isValid;
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

function AABB(lower, upper) {
  if (!(this instanceof AABB)) {
    return new AABB(lower, upper);
  }

  this.lowerBound = (0, _Vec.zero)();
  this.upperBound = (0, _Vec.zero)();

  if ((typeof lower === "undefined" ? "undefined" : _typeof(lower)) === 'object') {
    this.lowerBound.set(lower);
  }
  if ((typeof upper === "undefined" ? "undefined" : _typeof(upper)) === 'object') {
    this.upperBound.set(upper);
  }
}

/**
 * Verify that the bounds are sorted.
 */
AABB.prototype.isValid = function () {
  return AABB_isValid(this);
};

exports.isValid = AABB_isValid = function AABB_isValid(aabb) {
  var d = (0, _Vec.sub)(aabb.upperBound, aabb.lowerBound);
  var valid = d.x >= 0.0 && d.y >= 0.0 && (0, _Vec.isValid)(aabb.lowerBound) && (0, _Vec.isValid)(aabb.upperBound);
  return valid;
};;

AABB_assert = function AABB_assert(o) {
  if (!_ASSERT) return;
  if (!AABB_isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error("Invalid AABB!");
  }
};;

/**
 * Get the center of the AABB.
 */
AABB.prototype.getCenter = function () {
  return (0, _Vec.neo)((this.lowerBound.x + this.upperBound.x) * 0.5, (this.lowerBound.y + this.upperBound.y) * 0.5);
};

/**
 * Get the extents of the AABB (half-widths).
 */
AABB.prototype.getExtents = function () {
  return (0, _Vec.neo)((this.upperBound.x - this.lowerBound.x) * 0.5, (this.upperBound.y - this.lowerBound.y) * 0.5);
};

/**
 * Get the perimeter length.
 */
AABB.prototype.getPerimeter = function () {
  return 2.0 * (this.upperBound.x - this.lowerBound.x + this.upperBound.y - this.lowerBound.y);
};

/**
 * Combine one or two AABB into this one.
 */
AABB.prototype.combine = function (a, b) {
  var lowerA = a.lowerBound;
  var upperA = a.upperBound;
  var lowerB = b.lowerBound;
  var upperB = b.upperBound;

  var lowerX = Math.min(lowerA.x, lowerB.x);
  var lowerY = Math.min(lowerA.y, lowerB.y);
  var upperX = Math.max(upperB.x, upperA.x);
  var upperY = Math.max(upperB.y, upperA.y);

  this.lowerBound.set(lowerX, lowerY);
  this.upperBound.set(upperX, upperY);
};

AABB.prototype.combinePoints = function (a, b) {
  this.lowerBound.set(Math.min(a.x, b.x), Math.min(a.y, b.y));
  this.upperBound.set(Math.max(a.x, b.x), Math.max(a.y, b.y));
};

AABB.prototype.set = function (aabb) {
  this.lowerBound.set(aabb.lowerBound.x, aabb.lowerBound.y);
  this.upperBound.set(aabb.upperBound.x, aabb.upperBound.y);
};

AABB.prototype.contains = function (aabb) {
  var result = true;
  result = result && this.lowerBound.x <= aabb.lowerBound.x;
  result = result && this.lowerBound.y <= aabb.lowerBound.y;
  result = result && aabb.upperBound.x <= this.upperBound.x;
  result = result && aabb.upperBound.y <= this.upperBound.y;
  return result;
};

AABB.prototype.extend = function (value) {
  AABB_extend(this, value);
};

exports.extend = AABB_extend = function AABB_extend(aabb, value) {
  aabb.lowerBound.x -= value;
  aabb.lowerBound.y -= value;
  aabb.upperBound.x += value;
  aabb.upperBound.y += value;
};;

exports.testOverlap = AABB_testOverlap = function AABB_testOverlap(a, b) {
  var d1x = b.lowerBound.x - a.upperBound.x;
  var d2x = a.lowerBound.x - b.upperBound.x;

  var d1y = b.lowerBound.y - a.upperBound.y;
  var d2y = a.lowerBound.y - b.upperBound.y;

  if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
    return false;
  }
  return true;
};;

exports.areEqual = AABB_areEqual = function AABB_areEqual(a, b) {
  return (0, _Vec.areEqual)(a.lowerBound, b.lowerBound) && (0, _Vec.areEqual)(a.upperBound, b.upperBound);
};;

AABB_diff = function AABB_diff(a, b) {
  var wD = Math.max(0, Math.min(a.upperBound.x, b.upperBound.x) - Math.max(b.lowerBound.x, a.lowerBound.x));
  var hD = Math.max(0, Math.min(a.upperBound.y, b.upperBound.y) - Math.max(b.lowerBound.y, a.lowerBound.y));

  var wA = a.upperBound.x - a.lowerBound.x;
  var hA = a.upperBound.y - a.lowerBound.y;

  var wB = b.upperBound.x - b.lowerBound.x;
  var hB = b.upperBound.y - b.lowerBound.y;

  return wA * hA + wB * hB - wD * hD;
};;

/**
 * @typedef RayCastInput
 *
 * Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
 *
 * @prop {Vec2} p1
 * @prop {Vec2} p2
 * @prop {number} maxFraction
 */

/**
 * @typedef RayCastInput
 *
 * Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and
 * p2 come from RayCastInput.
 *
 * @prop {Vec2} normal
 * @prop {number} fraction
 */

/**
 * @param {RayCastOutput} output
 * @param {RayCastInput} input
 * @returns {boolean}
 */
AABB.prototype.rayCast = function (output, input) {
  // From Real-time Collision Detection, p179.

  var tmin = -Infinity;
  var tmax = Infinity;

  var p = input.p1;
  var d = (0, _Vec.sub)(input.p2, input.p1);
  var absD = (0, _Vec.abs)(d);

  var normal = (0, _Vec.zero)();

  for (var f = 'x'; f !== null; f = f === 'x' ? 'y' : null) {
    if (absD.x < _Math.EPSILON) {
      // Parallel.
      if (p[f] < this.lowerBound[f] || this.upperBound[f] < p[f]) {
        return false;
      }
    } else {
      var inv_d = 1.0 / d[f];
      var t1 = (this.lowerBound[f] - p[f]) * inv_d;
      var t2 = (this.upperBound[f] - p[f]) * inv_d;

      // Sign of the normal vector.
      var s = -1.0;

      if (t1 > t2) {
        var temp = t1;
        t1 = t2, t2 = temp;
        s = 1.0;
      }

      // Push the min up
      if (t1 > tmin) {
        normal.setZero();
        normal[f] = s;
        tmin = t1;
      }

      // Pull the max down
      tmax = Math.min(tmax, t2);

      if (tmin > tmax) {
        return false;
      }
    }
  }

  // Does the ray start inside the box?
  // Does the ray intersect beyond the max fraction?
  if (tmin < 0.0 || input.maxFraction < tmin) {
    return false;
  }

  // Intersection.
  output.fraction = tmin;
  output.normal = normal;
  return true;
};

AABB.prototype.toString = function () {
  return JSON.stringify(this);
};
exports.isValid = AABB_isValid;
exports.extend = AABB_extend;
exports.testOverlap = AABB_testOverlap;
exports.areEqual = AABB_areEqual;

var exported_AABB = AABB;
exports.AABB = exported_AABB;
