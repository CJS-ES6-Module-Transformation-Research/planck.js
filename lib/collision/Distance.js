"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Distance = exports.Cache = exports.Proxy = exports.Output = exports.Input = exports.testOverlap = undefined;

var _Settings = require("../Settings");

var _common = require("../util/common");

var _Math = require("../common/Math");

var _Vec = require("../common/Vec2");

var _Rot = require("../common/Rot");

var _Transform = require("../common/Transform");

var Distance_Cache;
var Distance_Proxy;
var Distance_Output;
var Distance_Input;
var Distance_testOverlap;
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

exports.Input = Distance_Input = DistanceInput;;
exports.Output = Distance_Output = DistanceOutput;;
exports.Proxy = Distance_Proxy = DistanceProxy;;
exports.Cache = Distance_Cache = SimplexCache;;

var stats = {};

/**
 * GJK using Voronoi regions (Christer Ericson) and Barycentric coordinates.
 */

stats.gjkCalls = 0;
stats.gjkIters = 0;
stats.gjkMaxIters = 0;

/**
 * Input for Distance. You have to option to use the shape radii in the
 * computation. Even
 */
function DistanceInput() {
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.transformA = null;
  this.transformB = null;
  this.useRadii = false;
}

/**
 * Output for Distance.
 *
 * @prop {Vec2} pointA closest point on shapeA
 * @prop {Vec2} pointB closest point on shapeB
 * @prop distance
 * @prop iterations number of GJK iterations used
 */
function DistanceOutput() {
  this.pointA = _Vec.Vec2.zero();
  this.pointB = _Vec.Vec2.zero();
  this.distance;
  this.iterations;
}

/**
 * Used to warm start Distance. Set count to zero on first call.
 *
 * @prop {number} metric length or area
 * @prop {array} indexA vertices on shape A
 * @prop {array} indexB vertices on shape B
 * @prop {number} count
 */
function SimplexCache() {
  this.metric = 0;
  this.indexA = [];
  this.indexB = [];
  this.count = 0;
}

/**
 * Compute the closest points between two shapes. Supports any combination of:
 * CircleShape, PolygonShape, EdgeShape. The simplex cache is input/output. On
 * the first call set SimplexCache.count to zero.
 *
 * @param {DistanceOutput} output
 * @param {SimplexCache} cache
 * @param {DistanceInput} input
 */
function Distance(output, cache, input) {
  ++stats.gjkCalls;

  var proxyA = input.proxyA;
  var proxyB = input.proxyB;
  var xfA = input.transformA;
  var xfB = input.transformB;

  // Initialize the simplex.
  var simplex = new Simplex();
  simplex.readCache(cache, proxyA, xfA, proxyB, xfB);

  // Get simplex vertices as an array.
  var vertices = simplex.m_v; // SimplexVertex
  var k_maxIters = _Settings.maxDistnceIterations;

  // These store the vertices of the last simplex so that we
  // can check for duplicates and prevent cycling.
  var saveA = [];
  var saveB = []; // int[3]
  var saveCount = 0;

  var distanceSqr1 = Infinity;
  var distanceSqr2 = Infinity;

  // Main iteration loop.
  var iter = 0;
  while (iter < k_maxIters) {
    // Copy simplex so we can identify duplicates.
    saveCount = simplex.m_count;
    for (var i = 0; i < saveCount; ++i) {
      saveA[i] = vertices[i].indexA;
      saveB[i] = vertices[i].indexB;
    }

    simplex.solve();

    // If we have 3 points, then the origin is in the corresponding triangle.
    if (simplex.m_count == 3) {
      break;
    }

    // Compute closest point.
    var p = simplex.getClosestPoint();
    distanceSqr2 = p.lengthSquared();

    // Ensure progress
    if (distanceSqr2 >= distanceSqr1) {
      // break;
    }
    distanceSqr1 = distanceSqr2;

    // Get search direction.
    var d = simplex.getSearchDirection();

    // Ensure the search direction is numerically fit.
    if (d.lengthSquared() < _Math.EPSILON * _Math.EPSILON) {
      // The origin is probably contained by a line segment
      // or triangle. Thus the shapes are overlapped.

      // We can't return zero here even though there may be overlap.
      // In case the simplex is a point, segment, or triangle it is difficult
      // to determine if the origin is contained in the CSO or very close to it.
      break;
    }

    // Compute a tentative new simplex vertex using support points.
    var vertex = vertices[simplex.m_count]; // SimplexVertex

    vertex.indexA = proxyA.getSupport(_Rot.Rot.mulTVec2(xfA.q, _Vec.Vec2.neg(d)));
    vertex.wA = _Transform.Transform.mulVec2(xfA, proxyA.getVertex(vertex.indexA));

    vertex.indexB = proxyB.getSupport(_Rot.Rot.mulTVec2(xfB.q, d));
    vertex.wB = _Transform.Transform.mulVec2(xfB, proxyB.getVertex(vertex.indexB));

    vertex.w = _Vec.Vec2.sub(vertex.wB, vertex.wA);

    // Iteration count is equated to the number of support point calls.
    ++iter;
    ++stats.gjkIters;

    // Check for duplicate support points. This is the main termination
    // criteria.
    var duplicate = false;
    for (var i = 0; i < saveCount; ++i) {
      if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
        duplicate = true;
        break;
      }
    }

    // If we found a duplicate support point we must exit to avoid cycling.
    if (duplicate) {
      break;
    }

    // New vertex is ok and needed.
    ++simplex.m_count;
  }

  stats.gjkMaxIters = commonMath_mathjs.max(stats.gjkMaxIters, iter);

  // Prepare output.
  simplex.getWitnessPoints(output.pointA, output.pointB);
  output.distance = _Vec.Vec2.distance(output.pointA, output.pointB);
  output.iterations = iter;

  // Cache the simplex.
  simplex.writeCache(cache);

  // Apply radii if requested.
  if (input.useRadii) {
    var rA = proxyA.m_radius;
    var rB = proxyB.m_radius;

    if (output.distance > rA + rB && output.distance > _Math.EPSILON) {
      // Shapes are still no overlapped.
      // Move the witness points to the outer surface.
      output.distance -= rA + rB;
      var normal = _Vec.Vec2.sub(output.pointB, output.pointA);
      normal.normalize();
      output.pointA.addMul(rA, normal);
      output.pointB.subMul(rB, normal);
    } else {
      // Shapes are overlapped when radii are considered.
      // Move the witness points to the middle.
      var p = _Vec.Vec2.mid(output.pointA, output.pointB);
      output.pointA.set(p);
      output.pointB.set(p);
      output.distance = 0.0;
    }
  }
}

/**
 * A distance proxy is used by the GJK algorithm. It encapsulates any shape.
 */
function DistanceProxy() {
  this.m_buffer = []; // Vec2[2]
  this.m_vertices = []; // Vec2[]
  this.m_count = 0;
  this.m_radius = 0;
}

/**
 * Get the vertex count.
 */
DistanceProxy.prototype.getVertexCount = function () {
  return this.m_count;
};

/**
 * Get a vertex by index. Used by Distance.
 */
DistanceProxy.prototype.getVertex = function (index) {
  _ASSERT && (0, _common.assert)(0 <= index && index < this.m_count);
  return this.m_vertices[index];
};

/**
 * Get the supporting vertex index in the given direction.
 */
DistanceProxy.prototype.getSupport = function (d) {
  var bestIndex = 0;
  var bestValue = _Vec.Vec2.dot(this.m_vertices[0], d);
  for (var i = 0; i < this.m_count; ++i) {
    var value = _Vec.Vec2.dot(this.m_vertices[i], d);
    if (value > bestValue) {
      bestIndex = i;
      bestValue = value;
    }
  }
  return bestIndex;
};

/**
 * Get the supporting vertex in the given direction.
 */
DistanceProxy.prototype.getSupportVertex = function (d) {
  return this.m_vertices[this.getSupport(d)];
};

/**
 * Initialize the proxy using the given shape. The shape must remain in scope
 * while the proxy is in use.
 */
DistanceProxy.prototype.set = function (shape, index) {
  // TODO remove, use shape instead
  _ASSERT && (0, _common.assert)(typeof shape.computeDistanceProxy === 'function');
  shape.computeDistanceProxy(this, index);
};

function SimplexVertex() {
  this.indexA; // wA index
  this.indexB; // wB index
  this.wA = _Vec.Vec2.zero(); // support point in proxyA
  this.wB = _Vec.Vec2.zero(); // support point in proxyB
  this.w = _Vec.Vec2.zero(); // wB - wA
  this.a; // barycentric coordinate for closest point
}

SimplexVertex.prototype.set = function (v) {
  this.indexA = v.indexA;
  this.indexB = v.indexB;
  this.wA = _Vec.Vec2.clone(v.wA);
  this.wB = _Vec.Vec2.clone(v.wB);
  this.w = _Vec.Vec2.clone(v.w);
  this.a = v.a;
};

function Simplex() {
  this.m_v1 = new SimplexVertex();
  this.m_v2 = new SimplexVertex();
  this.m_v3 = new SimplexVertex();
  this.m_v = [this.m_v1, this.m_v2, this.m_v3];
  this.m_count;
}

Simplex.prototype.print = function () {
  if (this.m_count == 3) {
    return ["+" + this.m_count, this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y, this.m_v2.a, this.m_v2.wA.x, this.m_v2.wA.y, this.m_v2.wB.x, this.m_v2.wB.y, this.m_v3.a, this.m_v3.wA.x, this.m_v3.wA.y, this.m_v3.wB.x, this.m_v3.wB.y].toString();
  } else if (this.m_count == 2) {
    return ["+" + this.m_count, this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y, this.m_v2.a, this.m_v2.wA.x, this.m_v2.wA.y, this.m_v2.wB.x, this.m_v2.wB.y].toString();
  } else if (this.m_count == 1) {
    return ["+" + this.m_count, this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y].toString();
  } else {
    return "+" + this.m_count;
  }
};

// (SimplexCache, DistanceProxy, ...)
Simplex.prototype.readCache = function (cache, proxyA, transformA, proxyB, transformB) {
  _ASSERT && (0, _common.assert)(cache.count <= 3);

  // Copy data from cache.
  this.m_count = cache.count;
  for (var i = 0; i < this.m_count; ++i) {
    var v = this.m_v[i];
    v.indexA = cache.indexA[i];
    v.indexB = cache.indexB[i];
    var wALocal = proxyA.getVertex(v.indexA);
    var wBLocal = proxyB.getVertex(v.indexB);
    v.wA = _Transform.Transform.mulVec2(transformA, wALocal);
    v.wB = _Transform.Transform.mulVec2(transformB, wBLocal);
    v.w = _Vec.Vec2.sub(v.wB, v.wA);
    v.a = 0.0;
  }

  // Compute the new simplex metric, if it is substantially different than
  // old metric then flush the simplex.
  if (this.m_count > 1) {
    var metric1 = cache.metric;
    var metric2 = this.getMetric();
    if (metric2 < 0.5 * metric1 || 2.0 * metric1 < metric2 || metric2 < _Math.EPSILON) {
      // Reset the simplex.
      this.m_count = 0;
    }
  }

  // If the cache is empty or invalid...
  if (this.m_count == 0) {
    var v = this.m_v[0]; // SimplexVertex
    v.indexA = 0;
    v.indexB = 0;
    var wALocal = proxyA.getVertex(0);
    var wBLocal = proxyB.getVertex(0);
    v.wA = _Transform.Transform.mulVec2(transformA, wALocal);
    v.wB = _Transform.Transform.mulVec2(transformB, wBLocal);
    v.w = _Vec.Vec2.sub(v.wB, v.wA);
    v.a = 1.0;
    this.m_count = 1;
  }
};

// (SimplexCache)
Simplex.prototype.writeCache = function (cache) {
  cache.metric = this.getMetric();
  cache.count = this.m_count;
  for (var i = 0; i < this.m_count; ++i) {
    cache.indexA[i] = this.m_v[i].indexA;
    cache.indexB[i] = this.m_v[i].indexB;
  }
};

Simplex.prototype.getSearchDirection = function () {
  switch (this.m_count) {
    case 1:
      return _Vec.Vec2.neg(this.m_v1.w);

    case 2:
      {
        var e12 = _Vec.Vec2.sub(this.m_v2.w, this.m_v1.w);
        var sgn = _Vec.Vec2.cross(e12, _Vec.Vec2.neg(this.m_v1.w));
        if (sgn > 0.0) {
          // Origin is left of e12.
          return _Vec.Vec2.cross(1.0, e12);
        } else {
          // Origin is right of e12.
          return _Vec.Vec2.cross(e12, 1.0);
        }
      }

    default:
      _ASSERT && (0, _common.assert)(false);
      return _Vec.Vec2.zero();
  }
};

Simplex.prototype.getClosestPoint = function () {
  switch (this.m_count) {
    case 0:
      _ASSERT && (0, _common.assert)(false);
      return _Vec.Vec2.zero();

    case 1:
      return _Vec.Vec2.clone(this.m_v1.w);

    case 2:
      return _Vec.Vec2.combine(this.m_v1.a, this.m_v1.w, this.m_v2.a, this.m_v2.w);

    case 3:
      return _Vec.Vec2.zero();

    default:
      _ASSERT && (0, _common.assert)(false);
      return _Vec.Vec2.zero();
  }
};

Simplex.prototype.getWitnessPoints = function (pA, pB) {
  switch (this.m_count) {
    case 0:
      _ASSERT && (0, _common.assert)(false);
      break;

    case 1:
      pA.set(this.m_v1.wA);
      pB.set(this.m_v1.wB);
      break;

    case 2:
      pA.setCombine(this.m_v1.a, this.m_v1.wA, this.m_v2.a, this.m_v2.wA);
      pB.setCombine(this.m_v1.a, this.m_v1.wB, this.m_v2.a, this.m_v2.wB);
      break;

    case 3:
      pA.setCombine(this.m_v1.a, this.m_v1.wA, this.m_v2.a, this.m_v2.wA);
      pA.addMul(this.m_v3.a, this.m_v3.wA);
      pB.set(pA);
      break;

    default:
      _ASSERT && (0, _common.assert)(false);
      break;
  }
};

Simplex.prototype.getMetric = function () {
  switch (this.m_count) {
    case 0:
      _ASSERT && (0, _common.assert)(false);
      return 0.0;

    case 1:
      return 0.0;

    case 2:
      return _Vec.Vec2.distance(this.m_v1.w, this.m_v2.w);

    case 3:
      return _Vec.Vec2.cross(_Vec.Vec2.sub(this.m_v2.w, this.m_v1.w), _Vec.Vec2.sub(this.m_v3.w, this.m_v1.w));

    default:
      _ASSERT && (0, _common.assert)(false);
      return 0.0;
  }
};

Simplex.prototype.solve = function () {
  switch (this.m_count) {
    case 1:
      break;

    case 2:
      this.solve2();
      break;

    case 3:
      this.solve3();
      break;

    default:
      _ASSERT && (0, _common.assert)(false);
  }
};

// Solve a line segment using barycentric coordinates.
//
// p = a1 * w1 + a2 * w2
// a1 + a2 = 1
//
// The vector from the origin to the closest point on the line is
// perpendicular to the line.
// e12 = w2 - w1
// dot(p, e) = 0
// a1 * dot(w1, e) + a2 * dot(w2, e) = 0
//
// 2-by-2 linear system
// [1 1 ][a1] = [1]
// [w1.e12 w2.e12][a2] = [0]
//
// Define
// d12_1 = dot(w2, e12)
// d12_2 = -dot(w1, e12)
// d12 = d12_1 + d12_2
//
// Solution
// a1 = d12_1 / d12
// a2 = d12_2 / d12
Simplex.prototype.solve2 = function () {
  var w1 = this.m_v1.w;
  var w2 = this.m_v2.w;
  var e12 = _Vec.Vec2.sub(w2, w1);

  // w1 region
  var d12_2 = -_Vec.Vec2.dot(w1, e12);
  if (d12_2 <= 0.0) {
    // a2 <= 0, so we clamp it to 0
    this.m_v1.a = 1.0;
    this.m_count = 1;
    return;
  }

  // w2 region
  var d12_1 = _Vec.Vec2.dot(w2, e12);
  if (d12_1 <= 0.0) {
    // a1 <= 0, so we clamp it to 0
    this.m_v2.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v2);
    return;
  }

  // Must be in e12 region.
  var inv_d12 = 1.0 / (d12_1 + d12_2);
  this.m_v1.a = d12_1 * inv_d12;
  this.m_v2.a = d12_2 * inv_d12;
  this.m_count = 2;
};

// Possible regions:
// - points[2]
// - edge points[0]-points[2]
// - edge points[1]-points[2]
// - inside the triangle
Simplex.prototype.solve3 = function () {
  var w1 = this.m_v1.w;
  var w2 = this.m_v2.w;
  var w3 = this.m_v3.w;

  // Edge12
  // [1 1 ][a1] = [1]
  // [w1.e12 w2.e12][a2] = [0]
  // a3 = 0
  var e12 = _Vec.Vec2.sub(w2, w1);
  var w1e12 = _Vec.Vec2.dot(w1, e12);
  var w2e12 = _Vec.Vec2.dot(w2, e12);
  var d12_1 = w2e12;
  var d12_2 = -w1e12;

  // Edge13
  // [1 1 ][a1] = [1]
  // [w1.e13 w3.e13][a3] = [0]
  // a2 = 0
  var e13 = _Vec.Vec2.sub(w3, w1);
  var w1e13 = _Vec.Vec2.dot(w1, e13);
  var w3e13 = _Vec.Vec2.dot(w3, e13);
  var d13_1 = w3e13;
  var d13_2 = -w1e13;

  // Edge23
  // [1 1 ][a2] = [1]
  // [w2.e23 w3.e23][a3] = [0]
  // a1 = 0
  var e23 = _Vec.Vec2.sub(w3, w2); // Vec2
  var w2e23 = _Vec.Vec2.dot(w2, e23);
  var w3e23 = _Vec.Vec2.dot(w3, e23);
  var d23_1 = w3e23;
  var d23_2 = -w2e23;

  // Triangle123
  var n123 = _Vec.Vec2.cross(e12, e13);

  var d123_1 = n123 * _Vec.Vec2.cross(w2, w3);
  var d123_2 = n123 * _Vec.Vec2.cross(w3, w1);
  var d123_3 = n123 * _Vec.Vec2.cross(w1, w2);

  // w1 region
  if (d12_2 <= 0.0 && d13_2 <= 0.0) {
    this.m_v1.a = 1.0;
    this.m_count = 1;
    return;
  }

  // e12
  if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
    var inv_d12 = 1.0 / (d12_1 + d12_2);
    this.m_v1.a = d12_1 * inv_d12;
    this.m_v2.a = d12_2 * inv_d12;
    this.m_count = 2;
    return;
  }

  // e13
  if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
    var inv_d13 = 1.0 / (d13_1 + d13_2);
    this.m_v1.a = d13_1 * inv_d13;
    this.m_v3.a = d13_2 * inv_d13;
    this.m_count = 2;
    this.m_v2.set(this.m_v3);
    return;
  }

  // w2 region
  if (d12_1 <= 0.0 && d23_2 <= 0.0) {
    this.m_v2.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v2);
    return;
  }

  // w3 region
  if (d13_1 <= 0.0 && d23_1 <= 0.0) {
    this.m_v3.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v3);
    return;
  }

  // e23
  if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
    var inv_d23 = 1.0 / (d23_1 + d23_2);
    this.m_v2.a = d23_1 * inv_d23;
    this.m_v3.a = d23_2 * inv_d23;
    this.m_count = 2;
    this.m_v1.set(this.m_v3);
    return;
  }

  // Must be in triangle123
  var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
  this.m_v1.a = d123_1 * inv_d123;
  this.m_v2.a = d123_2 * inv_d123;
  this.m_v3.a = d123_3 * inv_d123;
  this.m_count = 3;
};

/**
 * Determine if two generic shapes overlap.
 */
exports.testOverlap = Distance_testOverlap = function Distance_testOverlap(shapeA, indexA, shapeB, indexB, xfA, xfB) {
  var input = new DistanceInput();
  input.proxyA.set(shapeA, indexA);
  input.proxyB.set(shapeB, indexB);
  input.transformA = xfA;
  input.transformB = xfB;
  input.useRadii = true;

  var cache = new SimplexCache();

  var output = new DistanceOutput();
  Distance(output, cache, input);

  return output.distance < 10.0 * _Math.EPSILON;
};;
exports.testOverlap = Distance_testOverlap;
exports.Input = Distance_Input;
exports.Output = Distance_Output;
exports.Proxy = Distance_Proxy;
exports.Cache = Distance_Cache;
exports.Distance = Distance;