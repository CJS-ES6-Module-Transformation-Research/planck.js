Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rot = exports.Rot_mulTVec2 = exports.Rot_mulTRot = exports.Rot_mulT = exports.Rot_mulSub = exports.Rot_mulVec2 = exports.Rot_mulRot = exports.Rot_mul = exports.Rot_isValid = exports.Rot_identity = exports.Rot_clone = exports.Rot_neo = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _common = require("../util/common");

var _Vec = require("./Vec2");

var _Math = require("./Math");

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
  } else if ((typeof angle === "undefined" ? "undefined" : _typeof(angle)) === 'object') {
    this.set(angle);
  } else {
    this.setIdentity();
  }
}

exports.Rot_neo = Rot_neo = function Rot_neo(angle) {
  var obj = Object.create(Rot.prototype);
  obj.setAngle(angle);
  return obj;
};

exports.Rot_clone = Rot_clone = function Rot_clone(rot) {
  _ASSERT && Rot_assert(rot);
  var obj = Object.create(Rot.prototype);
  obj.s = rot.s;
  obj.c = rot.c;
  return obj;
};

exports.Rot_identity = Rot_identity = function Rot_identity() {
  var obj = Object.create(Rot.prototype);
  obj.s = 0.0;
  obj.c = 1.0;
  return obj;
};

exports.Rot_isValid = Rot_isValid = function Rot_isValid(o) {
  return o && (0, _Math.isFinite)(o.s) && (0, _Math.isFinite)(o.c);
};

Rot_assert = function Rot_assert(o) {
  if (!_ASSERT) return;
  if (!Rot_isValid(o)) {
    _DEBUG && common(o);
    throw new Error("Invalid Rot!");
  }
};

/**
 * Set to the identity rotation.
 */
Rot.prototype.setIdentity = function () {
  this.s = 0.0;
  this.c = 1.0;
};

Rot.prototype.set = function (angle) {
  if ((typeof angle === "undefined" ? "undefined" : _typeof(angle)) === 'object') {
    _ASSERT && Rot_assert(angle);
    this.s = angle.s;
    this.c = angle.c;
  } else {
    _ASSERT && (0, _Math.assert)(angle);
    // TODO_ERIN optimize
    this.s = Math.sin(angle);
    this.c = Math.cos(angle);
  }
};

/**
 * Set using an angle in radians.
 */
Rot.prototype.setAngle = function (angle) {
  _ASSERT && (0, _Math.assert)(angle);
  // TODO_ERIN optimize
  this.s = Math.sin(angle);
  this.c = Math.cos(angle);
};

/**
 * Get the angle in radians.
 */
Rot.prototype.getAngle = function () {
  return Math.atan2(this.s, this.c);
};

/**
 * Get the x-axis.
 */
Rot.prototype.getXAxis = function () {
  return (0, _Vec.neo)(this.c, this.s);
};

/**
 * Get the u-axis.
 */
Rot.prototype.getYAxis = function () {
  return (0, _Vec.neo)(-this.s, this.c);
};

exports.Rot_mul = Rot_mul = function Rot_mul(rot, m) {
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
    _ASSERT && (0, _Vec.assert)(m);
    return (0, _Vec.neo)(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
  }
};

exports.Rot_mulRot = Rot_mulRot = function Rot_mulRot(rot, m) {
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
};

exports.Rot_mulVec2 = Rot_mulVec2 = function Rot_mulVec2(rot, m) {
  _ASSERT && Rot_assert(rot);
  _ASSERT && (0, _Vec.assert)(m);
  return (0, _Vec.neo)(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
};

exports.Rot_mulSub = Rot_mulSub = function Rot_mulSub(rot, v, w) {
  var x = rot.c * (v.x - w.x) - rot.s * (v.y - w.y);
  var y = rot.s * (v.x - w.y) + rot.c * (v.y - w.y);
  return (0, _Vec.neo)(x, y);
};

exports.Rot_mulT = Rot_mulT = function Rot_mulT(rot, m) {
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
    _ASSERT && (0, _Vec.assert)(m);
    return (0, _Vec.neo)(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
  }
};

exports.Rot_mulTRot = Rot_mulTRot = function Rot_mulTRot(rot, m) {
  _ASSERT && Rot_assert(m);
  // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
  // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
  // s = qc * rs - qs * rc
  // c = qc * rc + qs * rs
  var qr = Rot_identity();
  qr.s = rot.c * m.s - rot.s * m.c;
  qr.c = rot.c * m.c + rot.s * m.s;
  return qr;
};

exports.Rot_mulTVec2 = Rot_mulTVec2 = function Rot_mulTVec2(rot, m) {
  _ASSERT && (0, _Vec.assert)(m);
  return (0, _Vec.neo)(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
};

exports.Rot_neo = Rot_neo;
exports.Rot_clone = Rot_clone;
exports.Rot_identity = Rot_identity;
exports.Rot_isValid = Rot_isValid;
exports.Rot_mul = Rot_mul;
exports.Rot_mulRot = Rot_mulRot;
exports.Rot_mulVec2 = Rot_mulVec2;
exports.Rot_mulSub = Rot_mulSub;
exports.Rot_mulT = Rot_mulT;
exports.Rot_mulTRot = Rot_mulTRot;
exports.Rot_mulTVec2 = Rot_mulTVec2;

var exported_Rot = Rot;

// TODO merge with Transform

/**
 * Initialize from an angle in radians.
 */
exports.Rot = exported_Rot;
