import { assert as Transform_common } from "../util/common";

import {
  Vec2 as Transform_Vec2,
  zero as Vec2js_zero,
  neo as Vec2js_neo,
  clone as Vec2js_clone,
  isValid as Vec2js_isValid,
  assert as Vec2js_assert,
  add as Vec2js_add,
  sub as Vec2js_sub,
} from "./Vec2";

import {
  Rot as Transform_Rot,
  clone as Rotjs_clone,
  identity as Rotjs_identity,
  isValid as Rotjs_isValid,
  mulRot as Rotjs_mulRot,
  mulVec2 as Rotjs_mulVec2,
  mulTRot as Rotjs_mulTRot,
  mulTVec2 as Rotjs_mulTVec2,
} from "./Rot";

var Transform_mulTXf;
var Transform_mulTVec2;
var Transform_mulT;
var Transform_mulXf;
var Transform_mulVec2;
var Transform_mulFn;
var Transform_mulAll;
var Transform_mul;
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

function Transform(position, rotation) {
  if (!(this instanceof Transform)) {
    return new Transform(position, rotation);
  }
  this.p = Vec2js_zero();
  this.q = Rotjs_identity();
  if (typeof position !== 'undefined') {
    this.p.set(position);
  }
  if (typeof rotation !== 'undefined') {
    this.q.set(rotation);
  }
}

Transform_clone = function(xf) {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2js_clone(xf.p);
  obj.q = Rotjs_clone(xf.q);
  return obj;
};

Transform_neo = function(position, rotation) {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2js_clone(position);
  obj.q = Rotjs_clone(rotation);
  return obj;
};

Transform_identity = function() {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2js_zero();
  obj.q = Rotjs_identity();
  return obj;
};

/**
 * Set this to the identity transform.
 */
Transform.prototype.setIdentity = function() {
  this.p.setZero();
  this.q.setIdentity();
}

/**
 * Set this based on the position and angle.
 */
Transform.prototype.set = function(a, b) {
  if (typeof b === 'undefined') {
    this.p.set(a.p);
    this.q.set(a.q);
  } else {
    this.p.set(a);
    this.q.set(b);
  }
}

Transform_isValid = function(o) {
  return o && Vec2js_isValid(o.p) && Rotjs_isValid(o.q);
};

Transform_assert = function(o) {
  if (!_ASSERT)
    return;
  if (!Transform_isValid(o)) {
    _DEBUG && Transform_common(o);
    throw new Error("Invalid Transform!");
  }
};

Transform_mul = function(a, b) {
  _ASSERT && Transform_assert(a);
  if (Array.isArray(b)) {
    var arr = [];
    for (var i = 0; i < b.length; i++) {
      arr[i] = Transform_mul(a, b[i]);
    }
    return arr;
  } else if ("x" in b && "y" in b) {
    _ASSERT && Vec2js_assert(b);
    var x = a.q.c * b.x - a.q.s * b.y + a.p.x;
    var y = a.q.s * b.x + a.q.c * b.y + a.p.y;
    return Vec2js_neo(x, y);
  } else if ("p" in b && "q" in b) {
    _ASSERT && Transform_assert(b);
    // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
    // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
    var xf = Transform_identity();
    xf.q = Rotjs_mulRot(a.q, b.q);
    xf.p = Vec2js_add(Rotjs_mulVec2(a.q, b.p), a.p);
    return xf;
  }
};

Transform_mulAll = function(a, b) {
  _ASSERT && Transform_assert(a);
  var arr = [];
  for (var i = 0; i < b.length; i++) {
    arr[i] = Transform_mul(a, b[i]);
  }
  return arr;
};

Transform_mulFn = function(a) {
  _ASSERT && Transform_assert(a);
  return function(b) {
    return Transform_mul(a, b);
  };
};

Transform_mulVec2 = function(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Vec2js_assert(b);
  var x = a.q.c * b.x - a.q.s * b.y + a.p.x;
  var y = a.q.s * b.x + a.q.c * b.y + a.p.y;
  return Vec2js_neo(x, y);
};

Transform_mulXf = function(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Transform_assert(b);
  // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
  // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
  var xf = Transform_identity();
  xf.q = Rotjs_mulRot(a.q, b.q);
  xf.p = Vec2js_add(Rotjs_mulVec2(a.q, b.p), a.p);
  return xf;
};

Transform_mulT = function(a, b) {
  _ASSERT && Transform_assert(a);
  if ("x" in b && "y" in b) {
    _ASSERT && Vec2js_assert(b);
    var px = b.x - a.p.x;
    var py = b.y - a.p.y;
    var x = a.q.c * px + a.q.s * py;
    var y = -a.q.s * px + a.q.c * py;
    return Vec2js_neo(x, y);
  } else if ("p" in b && "q" in b) {
    _ASSERT && Transform_assert(b);
    // v2 = A.q' * (B.q * v1 + B.p - A.p)
    // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
    var xf = Transform_identity();
    xf.q.set(Rotjs_mulTRot(a.q, b.q));
    xf.p.set(Rotjs_mulTVec2(a.q, Vec2js_sub(b.p, a.p)));
    return xf;
  }
};

Transform_mulTVec2 = function(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Vec2js_assert(b);
  var px = b.x - a.p.x;
  var py = b.y - a.p.y;
  var x = a.q.c * px + a.q.s * py;
  var y = -a.q.s * px + a.q.c * py;
  return Vec2js_neo(x, y);
};

Transform_mulTXf = function(a, b) {
  _ASSERT && Transform_assert(a);
  _ASSERT && Transform_assert(b);
  // v2 = A.q' * (B.q * v1 + B.p - A.p)
  // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
  var xf = Transform_identity();
  xf.q.set(Rotjs_mulTRot(a.q, b.q));
  xf.p.set(Rotjs_mulTVec2(a.q, Vec2js_sub(b.p, a.p)));
  return xf;
};

export { Transform_identity, Transform_mulVec2, Transform_mulT, Transform_mulTVec2, Transform_mulTXf };
var exported_Transform = Transform;

// TODO merge with Rot

/**
 * A transform contains translation and rotation. It is used to represent the
 * position and orientation of rigid frames. Initialize using a position vector
 * and a rotation.
 *
 * @prop {Vec2} position
 * @prop {Rot} rotation
 */
export { exported_Transform as Transform };
