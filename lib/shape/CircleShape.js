var CircleShape_CircleShape = CircleShape;
import { assert as utilcommon_assertjs } from "../util/common";
import { createjs as utilcreate_createjsjs } from "../util/create";
import { EPSILON as Mathjs_EPSILON } from "../common/Math";
import { Rot as commonRot_Rotjs } from "../common/Rot";
import { Vec2 as commonVec2_Vec2js } from "../common/Vec2";
import { Shape as Shape_Shapejs } from "../Shape";
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

CircleShape._super = Shape_Shapejs;
CircleShape.prototype = utilcreate_createjsjs(CircleShape._super.prototype);

CircleShape.TYPE = 'circle';

function CircleShape(a, b) {
  if (!(this instanceof CircleShape)) {
    return new CircleShape(a, b);
  }

  CircleShape._super.call(this);

  this.m_type = CircleShape.TYPE;
  this.m_p = commonVec2_Vec2js.zero();
  this.m_radius = 1;

  if (typeof a === 'object' && commonVec2_Vec2js.isValid(a)) {
    this.m_p.set(a);

    if (typeof b === 'number') {
      this.m_radius = b;
    }

  } else if (typeof a === 'number') {
    this.m_radius = a;
  }
}

CircleShape.prototype.getRadius = function() {
  return this.m_radius;
}

CircleShape.prototype.getCenter = function() {
  return this.m_p;
}

CircleShape.prototype.getVertex = function(index) {
  _ASSERT && utilcommon_assertjs(index == 0);
  return this.m_p;
}

CircleShape.prototype.getVertexCount = function(index) {
  return 1;
}

/**
 * @deprecated
 */
CircleShape.prototype._clone = function() {
  var clone = new CircleShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_p = this.m_p.clone();
  return clone;
}

CircleShape.prototype.getChildCount = function() {
  return 1;
}

CircleShape.prototype.testPoint = function(xf, p) {
  var center = commonVec2_Vec2js.add(xf.p, commonRot_Rotjs.mulVec2(xf.q, this.m_p));
  var d = commonVec2_Vec2js.sub(p, center);
  return commonVec2_Vec2js.dot(d, d) <= this.m_radius * this.m_radius;
}

// Collision Detection in Interactive 3D Environments by Gino van den Bergen
// From Section 3.1.2
// x = s + a * r
// norm(x) = radius
CircleShape.prototype.rayCast = function(output, input, xf, childIndex) {

  var position = commonVec2_Vec2js.add(xf.p, commonRot_Rotjs.mulVec2(xf.q, this.m_p));
  var s = commonVec2_Vec2js.sub(input.p1, position);
  var b = commonVec2_Vec2js.dot(s, s) - this.m_radius * this.m_radius;

  // Solve quadratic equation.
  var r = commonVec2_Vec2js.sub(input.p2, input.p1);
  var c = commonVec2_Vec2js.dot(s, r);
  var rr = commonVec2_Vec2js.dot(r, r);
  var sigma = c * c - rr * b;

  // Check for negative discriminant and short segment.
  if (sigma < 0.0 || rr < Mathjs_EPSILON) {
    return false;
  }

  // Find the point of intersection of the line with the circle.
  var a = -(c + commonMath_mathjs.sqrt(sigma));

  // Is the intersection point on the segment?
  if (0.0 <= a && a <= input.maxFraction * rr) {
    a /= rr;
    output.fraction = a;
    output.normal = commonVec2_Vec2js.add(s, commonVec2_Vec2js.mul(a, r));
    output.normal.normalize();
    return true;
  }

  return false;
}

CircleShape.prototype.computeAABB = function(aabb, xf, childIndex) {
  var p = commonVec2_Vec2js.add(xf.p, commonRot_Rotjs.mulVec2(xf.q, this.m_p));
  aabb.lowerBound.set(p.x - this.m_radius, p.y - this.m_radius);
  aabb.upperBound.set(p.x + this.m_radius, p.y + this.m_radius);
}

CircleShape.prototype.computeMass = function(massData, density) {
  massData.mass = density * commonMath_mathjs.PI * this.m_radius * this.m_radius;
  massData.center = this.m_p;
  // inertia about the local origin
  massData.I = massData.mass
      * (0.5 * this.m_radius * this.m_radius + commonVec2_Vec2js.dot(this.m_p, this.m_p));
}

CircleShape.prototype.computeDistanceProxy = function(proxy) {
  proxy.m_vertices.push(this.m_p);
  proxy.m_count = 1;
  proxy.m_radius = this.m_radius;
};
export { CircleShape_CircleShape as CircleShape };
