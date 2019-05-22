Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = CircleShape;

var _common = require("../util/common");

var common = _interopRequireWildcard(_common);

var _create = require("../util/create");

var _create2 = _interopRequireDefault(_create);

var _options = require("../util/options");

var _options2 = _interopRequireDefault(_options);

var _Math = require("../common/Math");

var _Math2 = _interopRequireDefault(_Math);

var _Transform = require("../common/Transform");

var _Transform2 = _interopRequireDefault(_Transform);

var _Rot = require("../common/Rot");

var _Rot2 = _interopRequireDefault(_Rot);

var _Vec = require("../common/Vec2");

var _Vec2 = _interopRequireDefault(_Vec);

var _AABB = require("../collision/AABB");

var _AABB2 = _interopRequireDefault(_AABB);

var _Settings = require("../Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _Shape = require("../Shape");

var _Shape2 = _interopRequireDefault(_Shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

CircleShape._super = _Shape2.default;
CircleShape.prototype = (0, _create2.default)(CircleShape._super.prototype);

CircleShape.TYPE = 'circle';

function CircleShape(a, b) {
  if (!(this instanceof CircleShape)) {
    return new CircleShape(a, b);
  }

  CircleShape._super.call(this);

  this.m_type = CircleShape.TYPE;
  this.m_p = _Vec2.default.zero();
  this.m_radius = 1;

  if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === 'object' && _Vec2.default.isValid(a)) {
    this.m_p.set(a);

    if (typeof b === 'number') {
      this.m_radius = b;
    }
  } else if (typeof a === 'number') {
    this.m_radius = a;
  }
}

CircleShape.prototype.getRadius = function () {
  return this.m_radius;
};

CircleShape.prototype.getCenter = function () {
  return this.m_p;
};

CircleShape.prototype.getVertex = function (index) {
  _ASSERT && common.assert(index == 0);
  return this.m_p;
};

CircleShape.prototype.getVertexCount = function (index) {
  return 1;
};

/**
 * @deprecated
 */
CircleShape.prototype._clone = function () {
  var clone = new CircleShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_p = this.m_p.clone();
  return clone;
};

CircleShape.prototype.getChildCount = function () {
  return 1;
};

CircleShape.prototype.testPoint = function (xf, p) {
  var center = _Vec2.default.add(xf.p, _Rot2.default.mulVec2(xf.q, this.m_p));
  var d = _Vec2.default.sub(p, center);
  return _Vec2.default.dot(d, d) <= this.m_radius * this.m_radius;
};

// Collision Detection in Interactive 3D Environments by Gino van den Bergen
// From Section 3.1.2
// x = s + a * r
// norm(x) = radius
CircleShape.prototype.rayCast = function (output, input, xf, childIndex) {

  var position = _Vec2.default.add(xf.p, _Rot2.default.mulVec2(xf.q, this.m_p));
  var s = _Vec2.default.sub(input.p1, position);
  var b = _Vec2.default.dot(s, s) - this.m_radius * this.m_radius;

  // Solve quadratic equation.
  var r = _Vec2.default.sub(input.p2, input.p1);
  var c = _Vec2.default.dot(s, r);
  var rr = _Vec2.default.dot(r, r);
  var sigma = c * c - rr * b;

  // Check for negative discriminant and short segment.
  if (sigma < 0.0 || rr < _Math2.default.EPSILON) {
    return false;
  }

  // Find the point of intersection of the line with the circle.
  var a = -(c + _Math2.default.sqrt(sigma));

  // Is the intersection point on the segment?
  if (0.0 <= a && a <= input.maxFraction * rr) {
    a /= rr;
    output.fraction = a;
    output.normal = _Vec2.default.add(s, _Vec2.default.mul(a, r));
    output.normal.normalize();
    return true;
  }

  return false;
};

CircleShape.prototype.computeAABB = function (aabb, xf, childIndex) {
  var p = _Vec2.default.add(xf.p, _Rot2.default.mulVec2(xf.q, this.m_p));
  aabb.lowerBound.set(p.x - this.m_radius, p.y - this.m_radius);
  aabb.upperBound.set(p.x + this.m_radius, p.y + this.m_radius);
};

CircleShape.prototype.computeMass = function (massData, density) {
  massData.mass = density * _Math2.default.PI * this.m_radius * this.m_radius;
  massData.center = this.m_p;
  // inertia about the local origin
  massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + _Vec2.default.dot(this.m_p, this.m_p));
};

CircleShape.prototype.computeDistanceProxy = function (proxy) {
  proxy.m_vertices.push(this.m_p);
  proxy.m_count = 1;
  proxy.m_radius = this.m_radius;
};
module.exports = exports.default;
