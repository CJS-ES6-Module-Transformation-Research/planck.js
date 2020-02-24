import { debug as Mat33_debug } from "../util/common";

import {
  Vec2 as Mat33_Vec2,
  zero as Vec2js_zero,
  neo as Vec2js_neo,
  assert as Vec2js_assert,
} from "./Vec2";

import { Vec3 as Mat33_Vec3 } from "./Vec3";
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

function Mat33(a, b, c) {
  if (typeof a === 'object' && a !== null) {
    this.ex = Vec3js_clone(a);
    this.ey = Vec3js_clone(b);
    this.ez = Vec3js_clone(c);
  } else {
    this.ex = Mat33_Vec3();
    this.ey = Mat33_Vec3();
    this.ez = Mat33_Vec3();
  }
}

Mat33.prototype.toString = function() {
  return JSON.stringify(this);
};

Mat33.isValid = function(o) {
  return o && Vec3js_isValid(o.ex) && Vec3js_isValid(o.ey) && Vec3js_isValid(o.ez);
};

Mat33.assert = function(o) {
  if (!_ASSERT) return;
  if (!Mat33.isValid(o)) {
    _DEBUG && Mat33_debug(o);
    throw new Error('Invalid Mat33!');
  }
};

/**
 * Set this matrix to all zeros.
 */
Mat33.prototype.setZero = function() {
  this.ex.setZero();
  this.ey.setZero();
  this.ez.setZero();
  return this;
}

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases.
 * 
 * @param {Vec3} v
 * @returns {Vec3}
 */
Mat33.prototype.solve33 = function(v) {
  var det = Vec3js_dot(this.ex, Vec3js_cross(this.ey, this.ez));
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var r = new Mat33_Vec3();
  r.x = det * Vec3js_dot(v, Vec3js_cross(this.ey, this.ez));
  r.y = det * Vec3js_dot(this.ex, Vec3js_cross(v, this.ez));
  r.z = det * Vec3js_dot(this.ex, Vec3js_cross(this.ey, v));
  return r;
}

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases. Solve only the upper 2-by-2 matrix
 * equation.
 * 
 * @param {Vec2} v
 * 
 * @returns {Vec2}
 */
Mat33.prototype.solve22 = function(v) {
  var a11 = this.ex.x;
  var a12 = this.ey.x;
  var a21 = this.ex.y;
  var a22 = this.ey.y;
  var det = a11 * a22 - a12 * a21;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var r = Vec2js_zero();
  r.x = det * (a22 * v.x - a12 * v.y);
  r.y = det * (a11 * v.y - a21 * v.x);
  return r;
}

/**
 * Get the inverse of this matrix as a 2-by-2. Returns the zero matrix if
 * singular.
 * 
 * @param {Mat33} M
 */
Mat33.prototype.getInverse22 = function(M) {
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  M.ex.x = det * d;
  M.ey.x = -det * b;
  M.ex.z = 0.0;
  M.ex.y = -det * c;
  M.ey.y = det * a;
  M.ey.z = 0.0;
  M.ez.x = 0.0;
  M.ez.y = 0.0;
  M.ez.z = 0.0;
}

/**
 * Get the symmetric inverse of this matrix as a 3-by-3. Returns the zero matrix
 * if singular.
 * 
 * @param {Mat33} M
 */
Mat33.prototype.getSymInverse33 = function(M) {
  var det = Vec3js_dot(this.ex, Vec3js_cross(this.ey, this.ez));
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var a11 = this.ex.x;
  var a12 = this.ey.x;
  var a13 = this.ez.x;
  var a22 = this.ey.y;
  var a23 = this.ez.y;
  var a33 = this.ez.z;

  M.ex.x = det * (a22 * a33 - a23 * a23);
  M.ex.y = det * (a13 * a23 - a12 * a33);
  M.ex.z = det * (a12 * a23 - a13 * a22);

  M.ey.x = M.ex.y;
  M.ey.y = det * (a11 * a33 - a13 * a13);
  M.ey.z = det * (a13 * a12 - a11 * a23);

  M.ez.x = M.ex.z;
  M.ez.y = M.ey.z;
  M.ez.z = det * (a11 * a22 - a12 * a12);
}

/**
 * Multiply a matrix times a vector.
 * 
 * @param {Mat33} a
 * @param {Vec3|Vec2} b
 * 
 * @returns {Vec3|Vec2}
 */
Mat33.mul = function(a, b) {
  _ASSERT && Mat33.assert(a);
  if (b && 'z' in b && 'y' in b && 'x' in b) {
    _ASSERT && Vec3js_assert(b);
    var x = a.ex.x * b.x + a.ey.x * b.y + a.ez.x * b.z;
    var y = a.ex.y * b.x + a.ey.y * b.y + a.ez.y * b.z;
    var z = a.ex.z * b.x + a.ey.z * b.y + a.ez.z * b.z;
    return new Mat33_Vec3(x, y, z);

  } else if (b && 'y' in b && 'x' in b) {
    _ASSERT && Vec2js_assert(b);
    var x = a.ex.x * b.x + a.ey.x * b.y;
    var y = a.ex.y * b.x + a.ey.y * b.y;
    return Vec2js_neo(x, y);
  }

  _ASSERT && common.assert(false);
}

Mat33.mulVec3 = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Vec3js_assert(b);
  var x = a.ex.x * b.x + a.ey.x * b.y + a.ez.x * b.z;
  var y = a.ex.y * b.x + a.ey.y * b.y + a.ez.y * b.z;
  var z = a.ex.z * b.x + a.ey.z * b.y + a.ez.z * b.z;
  return new Mat33_Vec3(x, y, z);
}

Mat33.mulVec2 = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Vec2js_assert(b);
  var x = a.ex.x * b.x + a.ey.x * b.y;
  var y = a.ex.y * b.x + a.ey.y * b.y;
  return Vec2js_neo(x, y);
}

Mat33.add = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Mat33.assert(b);
  return new Mat33(
    Vec3js_add(a.ex + b.ex),
    Vec3js_add(a.ey + b.ey),
    Vec3js_add(a.ez + b.ez)
  );
}
var exported_Mat33 = Mat33;

/**
 * A 3-by-3 matrix. Stored in column-major order.
 */
export { exported_Mat33 as Mat33 };
