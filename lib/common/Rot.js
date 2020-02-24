import { debug as common_debug } from "../util/common";
import { Vec2 as Vec2_Vec2, neo as Vec2js_neo, assert as Vec2js_assert } from "./Vec2";
import { isFinite as Mathjs_isFinite, assert as Mathjs_assert } from "./Math";
var Rot_mulTVec2;
var Rot_mulTRot;
var Rot_mulT;
var Rot_mulSub;
var Rot_mulVec2;
var Rot_mulRot;
var Rot_mul;
var Rot_assert;
var Rot_isValid;
var Rot_identity;
var Rot_clone;
var Rot_neo;
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

function Rot(angle) {
  if (!(this instanceof Rot)) {
    return new Rot(angle);
  }
  if (typeof angle === 'number') {
    this.setAngle(angle);
  } else if (typeof angle === 'object') {
      this.set(angle);
  } else {
    this.setIdentity();
  }
}

Rot_neo = function(angle) {
  var obj = Object.create(Rot.prototype);
  obj.setAngle(angle);
  return obj;
};;

Rot_clone = function(rot) {
  _ASSERT && Rot_assert(rot);
  var obj = Object.create(Rot.prototype);
  obj.s = rot.s;
  obj.c = rot.c;
  return obj;
};;

Rot_identity = function() {
  var obj = Object.create(Rot.prototype);
  obj.s = 0.0;
  obj.c = 1.0;
  return obj;
};;

Rot_isValid = function(o) {
  return o && Mathjs_isFinite(o.s) && Mathjs_isFinite(o.c);
};;

Rot_assert = function(o) {
  if (!_ASSERT)
    return;
  if (!Rot_isValid(o)) {
    _DEBUG && common_debug(o);
    throw new Error("Invalid Rot!");
  }
};;

/**
 * Set to the identity rotation.
 */
Rot.prototype.setIdentity = function() {
  this.s = 0.0;
  this.c = 1.0;
}

Rot.prototype.set = function(angle) {
  if (typeof angle === 'object') {
    _ASSERT && Rot_assert(angle);
    this.s = angle.s;
    this.c = angle.c;

  } else {
    _ASSERT && Mathjs_assert(angle);
    // TODO_ERIN optimize
    this.s = Math.sin(angle);
    this.c = Math.cos(angle);
  }
}

/**
 * Set using an angle in radians.
 */
Rot.prototype.setAngle = function(angle) {
  _ASSERT && Mathjs_assert(angle);
  // TODO_ERIN optimize
  this.s = Math.sin(angle);
  this.c = Math.cos(angle);
};

/**
 * Get the angle in radians.
 */
Rot.prototype.getAngle = function() {
  return Math.atan2(this.s, this.c);
}

/**
 * Get the x-axis.
 */
Rot.prototype.getXAxis = function() {
  return Vec2js_neo(this.c, this.s);
}

/**
 * Get the u-axis.
 */
Rot.prototype.getYAxis = function() {
  return Vec2js_neo(-this.s, this.c);
}

/**
 * Multiply two rotations: q * r
 * 
 * @returns Rot
 * 
 * Rotate a vector
 * 
 * @returns Vec2
 */
Rot_mul = function(rot, m) {
  _ASSERT && Rot_assert(rot);
  if ("c" in m && "s" in m) {
    _ASSERT && Rot_assert(m);
    // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
    // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
    // s = qs * rc + qc * rs
    // c = qc * rc - qs * rs
    var qr = Rot_identity();
    qr.s = rot.s * m.c + rot.c * m.s;
    qr.c = rot.c * m.c - rot.s * m.s;
    return qr;
  } else if ("x" in m && "y" in m) {
    _ASSERT && Vec2js_assert(m);
    return Vec2js_neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
  }
};;

Rot_mulRot = function(rot, m) {
  _ASSERT && Rot_assert(rot);
  _ASSERT && Rot_assert(m);
  // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
  // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
  // s = qs * rc + qc * rs
  // c = qc * rc - qs * rs
  var qr = Rot_identity();
  qr.s = rot.s * m.c + rot.c * m.s;
  qr.c = rot.c * m.c - rot.s * m.s;
  return qr;
};;

Rot_mulVec2 = function(rot, m) {
  _ASSERT && Rot_assert(rot);
  _ASSERT && Vec2js_assert(m);
  return Vec2js_neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
};;

Rot_mulSub = function(rot, v, w) {
  var x = rot.c * (v.x - w.x) - rot.s * (v.y - w.y);
  var y = rot.s * (v.x - w.y) + rot.c * (v.y - w.y);
  return Vec2js_neo(x, y);
};;

/**
 * Transpose multiply two rotations: qT * r
 * 
 * @returns Rot
 * 
 * Inverse rotate a vector
 * 
 * @returns Vec2
 */
Rot_mulT = function(rot, m) {
  if ("c" in m && "s" in m) {
    _ASSERT && Rot_assert(m);
    // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
    // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
    // s = qc * rs - qs * rc
    // c = qc * rc + qs * rs
    var qr = Rot_identity();
    qr.s = rot.c * m.s - rot.s * m.c;
    qr.c = rot.c * m.c + rot.s * m.s;
    return qr;
  } else if ("x" in m && "y" in m) {
    _ASSERT && Vec2js_assert(m);
    return Vec2js_neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
  }
};;

Rot_mulTRot = function(rot, m) {
  _ASSERT && Rot_assert(m);
  // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
  // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
  // s = qc * rs - qs * rc
  // c = qc * rc + qs * rs
  var qr = Rot_identity();
  qr.s = rot.c * m.s - rot.s * m.c;
  qr.c = rot.c * m.c + rot.s * m.s;
  return qr;
};;

Rot_mulTVec2 = function(rot, m) {
  _ASSERT && Vec2js_assert(m);
  return Vec2js_neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
};;
export { Rot_neo as neo, Rot_clone as clone, Rot_identity as identity, Rot_isValid as isValid, Rot_mul as mul, Rot_mulRot as mulRot, Rot_mulVec2 as mulVec2, Rot_mulSub as mulSub, Rot_mulT as mulT, Rot_mulTRot as mulTRot, Rot_mulTVec2 as mulTVec2 };
var exported_Rot = Rot;

// TODO merge with Transform

/**
 * Initialize from an angle in radians.
 */
export { exported_Rot as Rot };
