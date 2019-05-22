Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = AABB;

var _Settings = require("../Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _Math = require("../common/Math");

var _Math2 = _interopRequireDefault(_Math);

var _Vec = require("../common/Vec2");

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  this.lowerBound = _Vec2.default.zero();
  this.upperBound = _Vec2.default.zero();

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
  return AABB.isValid(this);
};

AABB.isValid = function (aabb) {
  var d = _Vec2.default.sub(aabb.upperBound, aabb.lowerBound);
  var valid = d.x >= 0.0 && d.y >= 0.0 && _Vec2.default.isValid(aabb.lowerBound) && _Vec2.default.isValid(aabb.upperBound);
  return valid;
};

AABB.assert = function (o) {
  if (!_ASSERT) return;
  if (!AABB.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid AABB!');
  }
};

/**
 * Get the center of the AABB.
 */
AABB.prototype.getCenter = function () {
  return _Vec2.default.neo((this.lowerBound.x + this.upperBound.x) * 0.5, (this.lowerBound.y + this.upperBound.y) * 0.5);
};

/**
 * Get the extents of the AABB (half-widths).
 */
AABB.prototype.getExtents = function () {
  return _Vec2.default.neo((this.upperBound.x - this.lowerBound.x) * 0.5, (this.upperBound.y - this.lowerBound.y) * 0.5);
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

  var lowerX = _Math2.default.min(lowerA.x, lowerB.x);
  var lowerY = _Math2.default.min(lowerA.y, lowerB.y);
  var upperX = _Math2.default.max(upperB.x, upperA.x);
  var upperY = _Math2.default.max(upperB.y, upperA.y);

  this.lowerBound.set(lowerX, lowerY);
  this.upperBound.set(upperX, upperY);
};

AABB.prototype.combinePoints = function (a, b) {
  this.lowerBound.set(_Math2.default.min(a.x, b.x), _Math2.default.min(a.y, b.y));
  this.upperBound.set(_Math2.default.max(a.x, b.x), _Math2.default.max(a.y, b.y));
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
  AABB.extend(this, value);
};

AABB.extend = function (aabb, value) {
  aabb.lowerBound.x -= value;
  aabb.lowerBound.y -= value;
  aabb.upperBound.x += value;
  aabb.upperBound.y += value;
};

AABB.testOverlap = function (a, b) {
  var d1x = b.lowerBound.x - a.upperBound.x;
  var d2x = a.lowerBound.x - b.upperBound.x;

  var d1y = b.lowerBound.y - a.upperBound.y;
  var d2y = a.lowerBound.y - b.upperBound.y;

  if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
    return false;
  }
  return true;
};

AABB.areEqual = function (a, b) {
  return _Vec2.default.areEqual(a.lowerBound, b.lowerBound) && _Vec2.default.areEqual(a.upperBound, b.upperBound);
};

AABB.diff = function (a, b) {
  var wD = _Math2.default.max(0, _Math2.default.min(a.upperBound.x, b.upperBound.x) - _Math2.default.max(b.lowerBound.x, a.lowerBound.x));
  var hD = _Math2.default.max(0, _Math2.default.min(a.upperBound.y, b.upperBound.y) - _Math2.default.max(b.lowerBound.y, a.lowerBound.y));

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
AABB.prototype.rayCast = function (output, input) {
  // From Real-time Collision Detection, p179.

  var tmin = -Infinity;
  var tmax = Infinity;

  var p = input.p1;
  var d = _Vec2.default.sub(input.p2, input.p1);
  var absD = _Vec2.default.abs(d);

  var normal = _Vec2.default.zero();

  for (var f = 'x'; f !== null; f = f === 'x' ? 'y' : null) {
    if (absD.x < _Math2.default.EPSILON) {
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
      tmax = _Math2.default.min(tmax, t2);

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
module.exports = exports.default;
