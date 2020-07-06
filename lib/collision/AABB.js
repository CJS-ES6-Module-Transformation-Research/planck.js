var AABB_AABB = AABB;
import { EPSILON as Mathjs_EPSILON } from "../common/Math";
import { Vec2 as commonVec2_Vec2js } from "../common/Vec2";
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

  this.lowerBound = commonVec2_Vec2js.zero();
  this.upperBound = commonVec2_Vec2js.zero();

  if (typeof lower === 'object') {
    this.lowerBound.set(lower);
  }
  if (typeof upper === 'object') {
    this.upperBound.set(upper);
  }
}

/**
 * Verify that the bounds are sorted.
 */
AABB.prototype.isValid = function() {
  return AABB.isValid(this);
}

AABB.isValid = function(aabb) {
  var d = commonVec2_Vec2js.sub(aabb.upperBound, aabb.lowerBound);
  var valid = d.x >= 0.0 && d.y >= 0.0 && commonVec2_Vec2js.isValid(aabb.lowerBound) && commonVec2_Vec2js.isValid(aabb.upperBound);
  return valid;
}

AABB.assert = function(o) {
  if (!_ASSERT) return;
  if (!AABB.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid AABB!');
  }
}

/**
 * Get the center of the AABB.
 */
AABB.prototype.getCenter = function() {
  return commonVec2_Vec2js.neo((this.lowerBound.x + this.upperBound.x) * 0.5, (this.lowerBound.y + this.upperBound.y) * 0.5);
}

/**
 * Get the extents of the AABB (half-widths).
 */
AABB.prototype.getExtents = function() {
  return commonVec2_Vec2js.neo((this.upperBound.x - this.lowerBound.x) * 0.5, (this.upperBound.y - this.lowerBound.y) * 0.5);
}

/**
 * Get the perimeter length.
 */
AABB.prototype.getPerimeter = function() {
  return 2.0 * (this.upperBound.x - this.lowerBound.x + this.upperBound.y - this.lowerBound.y);
}

/**
 * Combine one or two AABB into this one.
 */
AABB.prototype.combine = function(a, b) {
  var lowerA = a.lowerBound;
  var upperA = a.upperBound;
  var lowerB = b.lowerBound;
  var upperB = b.upperBound;

  var lowerX = commonMath_mathjs.min(lowerA.x, lowerB.x);
  var lowerY = commonMath_mathjs.min(lowerA.y, lowerB.y);
  var upperX = commonMath_mathjs.max(upperB.x, upperA.x);
  var upperY = commonMath_mathjs.max(upperB.y, upperA.y);

  this.lowerBound.set(lowerX, lowerY);
  this.upperBound.set(upperX, upperY);
}

AABB.prototype.combinePoints = function(a, b) {
  this.lowerBound.set(commonMath_mathjs.min(a.x, b.x), commonMath_mathjs.min(a.y, b.y));
  this.upperBound.set(commonMath_mathjs.max(a.x, b.x), commonMath_mathjs.max(a.y, b.y));
}

AABB.prototype.set = function(aabb) {
  this.lowerBound.set(aabb.lowerBound.x, aabb.lowerBound.y);
  this.upperBound.set(aabb.upperBound.x, aabb.upperBound.y);
}

AABB.prototype.contains = function(aabb) {
  var result = true;
  result = result && this.lowerBound.x <= aabb.lowerBound.x;
  result = result && this.lowerBound.y <= aabb.lowerBound.y;
  result = result && aabb.upperBound.x <= this.upperBound.x;
  result = result && aabb.upperBound.y <= this.upperBound.y;
  return result;
}

AABB.prototype.extend = function(value) {
  AABB.extend(this, value);
}

AABB.extend = function(aabb, value) {
  aabb.lowerBound.x -= value;
  aabb.lowerBound.y -= value;
  aabb.upperBound.x += value;
  aabb.upperBound.y += value;
}

AABB.testOverlap = function(a, b) {
  var d1x = b.lowerBound.x - a.upperBound.x;
  var d2x = a.lowerBound.x - b.upperBound.x;

  var d1y = b.lowerBound.y - a.upperBound.y;
  var d2y = a.lowerBound.y - b.upperBound.y;

  if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
    return false;
  }
  return true;
}

AABB.areEqual = function(a, b) {
  return commonVec2_Vec2js.areEqual(a.lowerBound, b.lowerBound) && commonVec2_Vec2js.areEqual(a.upperBound, b.upperBound);
}

AABB.diff = function(a, b) {
  var wD = commonMath_mathjs.max(0, commonMath_mathjs.min(a.upperBound.x, b.upperBound.x) - commonMath_mathjs.max(b.lowerBound.x, a.lowerBound.x))
  var hD = commonMath_mathjs.max(0, commonMath_mathjs.min(a.upperBound.y, b.upperBound.y) - commonMath_mathjs.max(b.lowerBound.y, a.lowerBound.y));

  var wA = a.upperBound.x - a.lowerBound.x;
  var hA = a.upperBound.y - a.lowerBound.y;

  var wB = b.upperBound.x - b.lowerBound.x;
  var hB = b.upperBound.y - b.lowerBound.y;

  return wA * hA + wB * hB - wD * hD;
};

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
AABB.prototype.rayCast = function(output, input) {
  // From Real-time Collision Detection, p179.

  var tmin = -Infinity;
  var tmax = Infinity;

  var p = input.p1;
  var d = commonVec2_Vec2js.sub(input.p2, input.p1);
  var absD = commonVec2_Vec2js.abs(d);

  var normal = commonVec2_Vec2js.zero();

  for (var f = 'x'; f !== null; f = (f === 'x' ? 'y' : null)) {
    if (absD.x < Mathjs_EPSILON) {
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
      tmax = commonMath_mathjs.min(tmax, t2);

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
}

AABB.prototype.toString = function() {
  return JSON.stringify(this);
}
export { AABB_AABB as AABB };