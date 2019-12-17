Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EdgeShape = undefined;

var _create = require("../util/create");

var _options = require("../util/options");

var _Settings = require("../Settings");

var _Shape = require("../Shape");

var _Math = require("../common/Math");

var _Transform = require("../common/Transform");

var _Rot = require("../common/Rot");

var _Vec = require("../common/Vec2");

var _AABB = require("../collision/AABB");

var exported_EdgeShape = EdgeShape;
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

EdgeShape._super = _Shape.Shape;
EdgeShape.prototype = (0, _create.createjs)(EdgeShape._super.prototype);

EdgeShape.TYPE = 'edge';

function EdgeShape(v1, v2) {
  if (!(this instanceof EdgeShape)) {
    return new EdgeShape(v1, v2);
  }

  EdgeShape._super.call(this);

  this.m_type = EdgeShape.TYPE;
  this.m_radius = _Settings.Settings.polygonRadius;

  // These are the edge vertices
  this.m_vertex1 = v1 ? _Vec.Vec2.clone(v1) : _Vec.Vec2.zero();
  this.m_vertex2 = v2 ? _Vec.Vec2.clone(v2) : _Vec.Vec2.zero();

  // Optional adjacent vertices. These are used for smooth collision.
  // Used by chain shape.
  this.m_vertex0 = _Vec.Vec2.zero();
  this.m_vertex3 = _Vec.Vec2.zero();
  this.m_hasVertex0 = false;
  this.m_hasVertex3 = false;
}

EdgeShape.prototype.setNext = function (v3) {
  if (v3) {
    this.m_vertex3.set(v3);
    this.m_hasVertex3 = true;
  } else {
    this.m_vertex3.setZero();
    this.m_hasVertex3 = false;
  }
  return this;
};

EdgeShape.prototype.setPrev = function (v0) {
  if (v0) {
    this.m_vertex0.set(v0);
    this.m_hasVertex0 = true;
  } else {
    this.m_vertex0.setZero();
    this.m_hasVertex0 = false;
  }
  return this;
};

/**
 * Set this as an isolated edge.
 */
EdgeShape.prototype._set = function (v1, v2) {
  this.m_vertex1.set(v1);
  this.m_vertex2.set(v2);
  this.m_hasVertex0 = false;
  this.m_hasVertex3 = false;
  return this;
};

/**
 * @deprecated
 */
EdgeShape.prototype._clone = function () {
  var clone = new EdgeShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_vertex1.set(this.m_vertex1);
  clone.m_vertex2.set(this.m_vertex2);
  clone.m_vertex0.set(this.m_vertex0);
  clone.m_vertex3.set(this.m_vertex3);
  clone.m_hasVertex0 = this.m_hasVertex0;
  clone.m_hasVertex3 = this.m_hasVertex3;
  return clone;
};

EdgeShape.prototype.getChildCount = function () {
  return 1;
};

EdgeShape.prototype.testPoint = function (xf, p) {
  return false;
};

// p = p1 + t * d
// v = v1 + s * e
// p1 + t * d = v1 + s * e
// s * e - t * d = p1 - v1
EdgeShape.prototype.rayCast = function (output, input, xf, childIndex) {
  // NOT_USED(childIndex);

  // Put the ray into the edge's frame of reference.
  var p1 = _Rot.Rot.mulTVec2(xf.q, _Vec.Vec2.sub(input.p1, xf.p));
  var p2 = _Rot.Rot.mulTVec2(xf.q, _Vec.Vec2.sub(input.p2, xf.p));
  var d = _Vec.Vec2.sub(p2, p1);

  var v1 = this.m_vertex1;
  var v2 = this.m_vertex2;
  var e = _Vec.Vec2.sub(v2, v1);
  var normal = _Vec.Vec2.neo(e.y, -e.x);
  normal.normalize();

  // q = p1 + t * d
  // dot(normal, q - v1) = 0
  // dot(normal, p1 - v1) + t * dot(normal, d) = 0
  var numerator = _Vec.Vec2.dot(normal, _Vec.Vec2.sub(v1, p1));
  var denominator = _Vec.Vec2.dot(normal, d);

  if (denominator == 0.0) {
    return false;
  }

  var t = numerator / denominator;
  if (t < 0.0 || input.maxFraction < t) {
    return false;
  }

  var q = _Vec.Vec2.add(p1, _Vec.Vec2.mul(t, d));

  // q = v1 + s * r
  // s = dot(q - v1, r) / dot(r, r)
  var r = _Vec.Vec2.sub(v2, v1);
  var rr = _Vec.Vec2.dot(r, r);
  if (rr == 0.0) {
    return false;
  }

  var s = _Vec.Vec2.dot(_Vec.Vec2.sub(q, v1), r) / rr;
  if (s < 0.0 || 1.0 < s) {
    return false;
  }

  output.fraction = t;
  if (numerator > 0.0) {
    output.normal = _Rot.Rot.mulVec2(xf.q, normal).neg();
  } else {
    output.normal = _Rot.Rot.mulVec2(xf.q, normal);
  }
  return true;
};

EdgeShape.prototype.computeAABB = function (aabb, xf, childIndex) {
  var v1 = _Transform.Transform.mulVec2(xf, this.m_vertex1);
  var v2 = _Transform.Transform.mulVec2(xf, this.m_vertex2);

  aabb.combinePoints(v1, v2);
  aabb.extend(this.m_radius);
};

EdgeShape.prototype.computeMass = function (massData, density) {
  massData.mass = 0.0;
  massData.center.setCombine(0.5, this.m_vertex1, 0.5, this.m_vertex2);
  massData.I = 0.0;
};

EdgeShape.prototype.computeDistanceProxy = function (proxy) {
  proxy.m_vertices.push(this.m_vertex1);
  proxy.m_vertices.push(this.m_vertex2);
  proxy.m_count = 2;
  proxy.m_radius = this.m_radius;
};

/**
 * A line segment (edge) shape. These can be connected in chains or loops to
 * other edge shapes. The connectivity information is used to ensure correct
 * contact normals.
 */
exports.EdgeShape = exported_EdgeShape;
