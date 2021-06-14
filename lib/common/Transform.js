"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = exports.mulTXf = exports.mulTVec2 = exports.mulT = exports.mulVec2 = exports.identity = undefined;

var _common = require("../util/common");

var _Vec = require("./Vec2");

var _Rot = require("./Rot");

var Transform_mulTXf;
var Transform_mulTVec2;
var Transform_mulT;
var Transform_mulXf;
var Transform_mulVec2;
var Transform_mulFn;
var Transform_mulAll;
var i;
var _Transform_mul;
var Transform_assert;
var Transform_isValid;
var Transform_identity;
var Transform_neo;
var Transform_clone;
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

// TODO merge with Rot

/**
 * A transform contains translation and rotation. It is used to represent the
 * position and orientation of rigid frames. Initialize using a position vector
 * and a rotation.
 *
 * @prop {Vec2} position
 * @prop {Rot} rotation
 */
function Transform(position, rotation) {
  if (!(this instanceof Transform)) {
    return new Transform(position, rotation);
  }
  this.p = (0, _Vec.zero)();
  this.q = (0, _Rot.identity)();
  if (typeof position !== 'undefined') {
    this.p.set(position);
  }
  if (typeof rotation !== 'undefined') {
    this.q.set(rotation);
  }
}

Transform_clone = function Transform_clone(xf) {
  var obj = Object.create(Transform.prototype);
  obj.p = (0, _Vec.clone)(xf.p);
  obj.q = (0, _Rot.clone)(xf.q);
  return obj;
};

Transform_neo = function Transform_neo(position, rotation) {
  var obj = Object.create(Transform.prototype);
  obj.p = (0, _Vec.clone)(position);
  obj.q = (0, _Rot.clone)(rotation);
  return obj;
};

exports.identity = Transform_identity = function Transform_identity() {
  var obj = Object.create(Transform.prototype);
  obj.p = (0, _Vec.zero)();
  obj.q = (0, _Rot.identity)();
  return obj;
};

/**
 * Set this to the identity transform.
 */
Transform.prototype.setIdentity = function () {
  this.p.setZero();
  this.q.setIdentity();
};

/**
 * Set this based on the position and angle.
 */
Transform.prototype.set = function (a, b) {
  if (typeof b === 'undefined') {
    this.p.set(a.p);
    this.q.set(a.q);
  } else {
    this.p.set(a);
    this.q.set(b);
  }
};

Transform_isValid = function Transform_isValid(o) {
  return o && (0, _Vec.isValid)(o.p) && (0, _Rot.isValid)(o.q);
};

Transform_assert = function Transform_assert(o) {
  if (!_ASSERT) return;
  if (!Transform_isValid(o)) {
    _DEBUG && (0, _common.debug)(o);
    throw new Error('Invalid Transform!');
  }
};

/**
 * @param {Transform} a
 * @param {Vec2} b
 * @returns {Vec2}
 *
 * @param {Transform} a
 * @param {Transform} b
 * @returns {Transform}
 */
_Transform_mul = function Transform_mul(a, b) {
  _ASSERT && Transform_assert(a);
  if (Array.isArray(b)) {
    var arr = [];
    for (var i = 0; i < b.length; i++) {
      i = _Transform_mul(a, b[i]);;
    }
    return arr;
  } else if ('x' in b && 'y' in b) {
    _ASSERT && (0, _Vec.assert)(b);
    var x = a.q.c * b.x - a.q.s * b.y + a.p.x;
    var y = a.q.s * b.x + a.q.c * b.y + a.p.y;
    return (0, _Vec.neo)(x, y);
  } else if ('p' in b && 'q' in b) {
    _ASSERT && Transform_assert(b);
    // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
    // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
    var xf = Transform_identity();
    xf.q = (0, _Rot.mulRot)(a.q, b.q);
    xf.p = (0, _Vec.add)((0, _Rot.mulVec2)(a.q, b.p), a.p);
    return xf;
  }
};

/**
 * @deprecated Use mulFn instead.
 */
Transform_mulAll = function Transform_mulAll(a, b) {
  _ASSERT && Transform_assert(a);
  var arr = [];
  for (var i = 0; i < b.length; i++) {
    arr[i] = _Transform_mul(a, b[i]);
  }
  return arr;
};

/**
 * @experimental
 */
Transform_mulFn = function Transform_mulFn(a) {
  _ASSERT && Transform_assert(a);
  return function (b) {
    return _Transform_mul(a, b);
  };
};

exports.mulVec2 = Transform_mulVec2 = function Transform_mulVec2(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && (0, _Vec.assert)(b);
  var x = a.q.c * b.x - a.q.s * b.y + a.p.x;
  var y = a.q.s * b.x + a.q.c * b.y + a.p.y;
  return (0, _Vec.neo)(x, y);
};

Transform_mulXf = function Transform_mulXf(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Transform_assert(b);
  // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
  // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
  var xf = Transform_identity();
  xf.q = (0, _Rot.mulRot)(a.q, b.q);
  xf.p = (0, _Vec.add)((0, _Rot.mulVec2)(a.q, b.p), a.p);
  return xf;
};

/**
 * @param {Transform} a
 * @param {Vec2} b
 * @returns {Vec2}
 *
 * @param {Transform} a
 * @param {Transform} b
 * @returns {Transform}
 */
exports.mulT = Transform_mulT = function Transform_mulT(a, b) {
  _ASSERT && Transform_assert(a);
  if ('x' in b && 'y' in b) {
    _ASSERT && (0, _Vec.assert)(b);
    var px = b.x - a.p.x;
    var py = b.y - a.p.y;
    var x = a.q.c * px + a.q.s * py;
    var y = -a.q.s * px + a.q.c * py;
    return (0, _Vec.neo)(x, y);
  } else if ('p' in b && 'q' in b) {
    _ASSERT && Transform_assert(b);
    // v2 = A.q' * (B.q * v1 + B.p - A.p)
    // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
    var xf = Transform_identity();
    xf.q.set((0, _Rot.mulTRot)(a.q, b.q));
    xf.p.set((0, _Rot.mulTVec2)(a.q, (0, _Vec.sub)(b.p, a.p)));
    return xf;
  }
};

exports.mulTVec2 = Transform_mulTVec2 = function Transform_mulTVec2(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && (0, _Vec.assert)(b);
  var px = b.x - a.p.x;
  var py = b.y - a.p.y;
  var x = a.q.c * px + a.q.s * py;
  var y = -a.q.s * px + a.q.c * py;
  return (0, _Vec.neo)(x, y);
};

exports.mulTXf = Transform_mulTXf = function Transform_mulTXf(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Transform_assert(b);
  // v2 = A.q' * (B.q * v1 + B.p - A.p)
  // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
  var xf = Transform_identity();
  xf.q.set((0, _Rot.mulTRot)(a.q, b.q));
  xf.p.set((0, _Rot.mulTVec2)(a.q, (0, _Vec.sub)(b.p, a.p)));
  return xf;
};
exports.identity = Transform_identity;
exports.mulVec2 = Transform_mulVec2;
exports.mulT = Transform_mulT;
exports.mulTVec2 = Transform_mulTVec2;
exports.mulTXf = Transform_mulTXf;
exports.Transform = Transform;