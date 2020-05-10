"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rot = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _common = require("../util/common");

var utilcommon_debugjs = _interopRequireWildcard(_common);

var _Vec = require("./Vec2");

var _Math = require("./Math");

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

var Rot_Rot = Rot;

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

Rot.neo = function (angle) {
  var obj = Object.create(Rot.prototype);
  obj.setAngle(angle);
  return obj;
};

Rot.clone = function (rot) {
  _ASSERT && Rot.assert(rot);
  var obj = Object.create(Rot.prototype);
  obj.s = rot.s;
  obj.c = rot.c;
  return obj;
};

Rot.identity = function () {
  var obj = Object.create(Rot.prototype);
  obj.s = 0.0;
  obj.c = 1.0;
  return obj;
};

Rot.isValid = function (o) {
  return o && _Math.math.isFinite(o.s) && _Math.math.isFinite(o.c);
};

Rot.assert = function (o) {
  if (!_ASSERT) return;
  if (!Rot.isValid(o)) {
    _DEBUG && utilcommon_debugjs.debug(o);
    throw new Error('Invalid Rot!');
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
    _ASSERT && Rot.assert(angle);
    this.s = angle.s;
    this.c = angle.c;
  } else {
    _ASSERT && _Math.math.assert(angle);
    // TODO_ERIN optimize
    this.s = _Math.math.sin(angle);
    this.c = _Math.math.cos(angle);
  }
};

/**
 * Set using an angle in radians.
 */
Rot.prototype.setAngle = function (angle) {
  _ASSERT && _Math.math.assert(angle);
  // TODO_ERIN optimize
  this.s = _Math.math.sin(angle);
  this.c = _Math.math.cos(angle);
};

/**
 * Get the angle in radians.
 */
Rot.prototype.getAngle = function () {
  return _Math.math.atan2(this.s, this.c);
};

/**
 * Get the x-axis.
 */
Rot.prototype.getXAxis = function () {
  return _Vec.Vec2.neo(this.c, this.s);
};

/**
 * Get the u-axis.
 */
Rot.prototype.getYAxis = function () {
  return _Vec.Vec2.neo(-this.s, this.c);
};

/**
 * Multiply two rotations: q * r
 * 
 * @returns Rot
 * 
 * Rotate a vector
 * 
 * @returns Vec2
 */
Rot.mul = function (rot, m) {
  _ASSERT && Rot.assert(rot);
  if ('c' in m && 's' in m) {
    _ASSERT && Rot.assert(m);
    // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
    // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
    // s = qs * rc + qc * rs
    // c = qc * rc - qs * rs
    var qr = Rot.identity();
    qr.s = rot.s * m.c + rot.c * m.s;
    qr.c = rot.c * m.c - rot.s * m.s;
    return qr;
  } else if ('x' in m && 'y' in m) {
    _ASSERT && _Vec.Vec2.assert(m);
    return _Vec.Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
  }
};

Rot.mulRot = function (rot, m) {
  _ASSERT && Rot.assert(rot);
  _ASSERT && Rot.assert(m);
  // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
  // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
  // s = qs * rc + qc * rs
  // c = qc * rc - qs * rs
  var qr = Rot.identity();
  qr.s = rot.s * m.c + rot.c * m.s;
  qr.c = rot.c * m.c - rot.s * m.s;
  return qr;
};

Rot.mulVec2 = function (rot, m) {
  _ASSERT && Rot.assert(rot);
  _ASSERT && _Vec.Vec2.assert(m);
  return _Vec.Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
};

Rot.mulSub = function (rot, v, w) {
  var x = rot.c * (v.x - w.x) - rot.s * (v.y - w.y);
  var y = rot.s * (v.x - w.y) + rot.c * (v.y - w.y);
  return _Vec.Vec2.neo(x, y);
};

/**
 * Transpose multiply two rotations: qT * r
 * 
 * @returns Rot
 * 
 * Inverse rotate a vector
 * 
 * @returns Vec2
 */
Rot.mulT = function (rot, m) {
  if ('c' in m && 's' in m) {
    _ASSERT && Rot.assert(m);
    // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
    // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
    // s = qc * rs - qs * rc
    // c = qc * rc + qs * rs
    var qr = Rot.identity();
    qr.s = rot.c * m.s - rot.s * m.c;
    qr.c = rot.c * m.c + rot.s * m.s;
    return qr;
  } else if ('x' in m && 'y' in m) {
    _ASSERT && _Vec.Vec2.assert(m);
    return _Vec.Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
  }
};

Rot.mulTRot = function (rot, m) {
  _ASSERT && Rot.assert(m);
  // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
  // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
  // s = qc * rs - qs * rc
  // c = qc * rc + qs * rs
  var qr = Rot.identity();
  qr.s = rot.c * m.s - rot.s * m.c;
  qr.c = rot.c * m.c + rot.s * m.s;
  return qr;
};

Rot.mulTVec2 = function (rot, m) {
  _ASSERT && _Vec.Vec2.assert(m);
  return _Vec.Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
};

// TODO merge with Transform

/**
 * Initialize from an angle in radians.
 */
exports.Rot = Rot_Rot;