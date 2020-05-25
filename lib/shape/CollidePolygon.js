"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollidePolygons = undefined;

var _common = require("../util/common");

var _Transform = require("../common/Transform");

var _Rot = require("../common/Rot");

var _Vec = require("../common/Vec2");

var _Settings = require("../Settings");

var _Manifold = require("../Manifold");

var _Contact = require("../Contact");

var _PolygonShape = require("./PolygonShape");

var CollidePolygon_CollidePolygons = CollidePolygons;

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

_Contact.Contact.addType(_PolygonShape.PolygonShape.TYPE, _PolygonShape.PolygonShape.TYPE, PolygonContact);

function PolygonContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && (0, _common.assert)(fixtureA.getType() == _PolygonShape.PolygonShape.TYPE);
  _ASSERT && (0, _common.assert)(fixtureB.getType() == _PolygonShape.PolygonShape.TYPE);
  CollidePolygons(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

/**
 * Find the max separation between poly1 and poly2 using edge normals from
 * poly1.
 */
function FindMaxSeparation(poly1, xf1, poly2, xf2) {
  var count1 = poly1.m_count;
  var count2 = poly2.m_count;
  var n1s = poly1.m_normals;
  var v1s = poly1.m_vertices;
  var v2s = poly2.m_vertices;
  var xf = _Transform.Transform.mulTXf(xf2, xf1);

  var bestIndex = 0;
  var maxSeparation = -Infinity;
  for (var i = 0; i < count1; ++i) {
    // Get poly1 normal in frame2.
    var n = _Rot.Rot.mulVec2(xf.q, n1s[i]);
    var v1 = _Transform.Transform.mulVec2(xf, v1s[i]);

    // Find deepest point for normal i.
    var si = Infinity;
    for (var j = 0; j < count2; ++j) {
      var sij = _Vec.Vec2.dot(n, v2s[j]) - _Vec.Vec2.dot(n, v1);
      if (sij < si) {
        si = sij;
      }
    }

    if (si > maxSeparation) {
      maxSeparation = si;
      bestIndex = i;
    }
  }

  // used to keep last FindMaxSeparation call values
  FindMaxSeparation._maxSeparation = maxSeparation;
  FindMaxSeparation._bestIndex = bestIndex;
}

/**
 * @param {ClipVertex[2]} c
 * @param {int} edge1
 */
function FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
  var normals1 = poly1.m_normals;

  var count2 = poly2.m_count;
  var vertices2 = poly2.m_vertices;
  var normals2 = poly2.m_normals;

  _ASSERT && (0, _common.assert)(0 <= edge1 && edge1 < poly1.m_count);

  // Get the normal of the reference edge in poly2's frame.
  var normal1 = _Rot.Rot.mulT(xf2.q, _Rot.Rot.mulVec2(xf1.q, normals1[edge1]));

  // Find the incident edge on poly2.
  var index = 0;
  var minDot = Infinity;
  for (var i = 0; i < count2; ++i) {
    var dot = _Vec.Vec2.dot(normal1, normals2[i]);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }

  // Build the clip vertices for the incident edge.
  var i1 = index;
  var i2 = i1 + 1 < count2 ? i1 + 1 : 0;

  c[0].v = _Transform.Transform.mulVec2(xf2, vertices2[i1]);
  c[0].id.cf.indexA = edge1;
  c[0].id.cf.indexB = i1;
  c[0].id.cf.typeA = _Manifold.Manifold.e_face;
  c[0].id.cf.typeB = _Manifold.Manifold.e_vertex;

  c[1].v = _Transform.Transform.mulVec2(xf2, vertices2[i2]);
  c[1].id.cf.indexA = edge1;
  c[1].id.cf.indexB = i2;
  c[1].id.cf.typeA = _Manifold.Manifold.e_face;
  c[1].id.cf.typeB = _Manifold.Manifold.e_vertex;
}

function CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
  manifold.pointCount = 0;
  var totalRadius = polyA.m_radius + polyB.m_radius;

  FindMaxSeparation(polyA, xfA, polyB, xfB);
  var edgeA = FindMaxSeparation._bestIndex;
  var separationA = FindMaxSeparation._maxSeparation;
  if (separationA > totalRadius) return;

  FindMaxSeparation(polyB, xfB, polyA, xfA);
  var edgeB = FindMaxSeparation._bestIndex;
  var separationB = FindMaxSeparation._maxSeparation;
  if (separationB > totalRadius) return;

  var poly1; // reference polygon
  var poly2; // incident polygon
  var xf1;
  var xf2;
  var edge1; // reference edge
  var flip;
  var k_tol = 0.1 * _Settings.Settings.linearSlop;

  if (separationB > separationA + k_tol) {
    poly1 = polyB;
    poly2 = polyA;
    xf1 = xfB;
    xf2 = xfA;
    edge1 = edgeB;
    manifold.type = _Manifold.Manifold.e_faceB;
    flip = 1;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    xf1 = xfA;
    xf2 = xfB;
    edge1 = edgeA;
    manifold.type = _Manifold.Manifold.e_faceA;
    flip = 0;
  }

  var incidentEdge = [new _Manifold.Manifold.clipVertex(), new _Manifold.Manifold.clipVertex()];
  FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

  var count1 = poly1.m_count;
  var vertices1 = poly1.m_vertices;

  var iv1 = edge1;
  var iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;

  var v11 = vertices1[iv1];
  var v12 = vertices1[iv2];

  var localTangent = _Vec.Vec2.sub(v12, v11);
  localTangent.normalize();

  var localNormal = _Vec.Vec2.cross(localTangent, 1.0);
  var planePoint = _Vec.Vec2.combine(0.5, v11, 0.5, v12);

  var tangent = _Rot.Rot.mulVec2(xf1.q, localTangent);
  var normal = _Vec.Vec2.cross(tangent, 1.0);

  v11 = _Transform.Transform.mulVec2(xf1, v11);
  v12 = _Transform.Transform.mulVec2(xf1, v12);

  // Face offset.
  var frontOffset = _Vec.Vec2.dot(normal, v11);

  // Side offsets, extended by polytope skin thickness.
  var sideOffset1 = -_Vec.Vec2.dot(tangent, v11) + totalRadius;
  var sideOffset2 = _Vec.Vec2.dot(tangent, v12) + totalRadius;

  // Clip incident edge against extruded edge1 side edges.
  var clipPoints1 = [new _Manifold.Manifold.clipVertex(), new _Manifold.Manifold.clipVertex()];
  var clipPoints2 = [new _Manifold.Manifold.clipVertex(), new _Manifold.Manifold.clipVertex()];
  var np;

  // Clip to box side 1
  np = _Manifold.Manifold.clipSegmentToLine(clipPoints1, incidentEdge, _Vec.Vec2.neg(tangent), sideOffset1, iv1);

  if (np < 2) {
    return;
  }

  // Clip to negative box side 1
  np = _Manifold.Manifold.clipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);

  if (np < 2) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  manifold.localNormal = localNormal;
  manifold.localPoint = planePoint;

  var pointCount = 0;
  for (var i = 0; i < clipPoints2.length /* maxManifoldPoints */; ++i) {
    var separation = _Vec.Vec2.dot(normal, clipPoints2[i].v) - frontOffset;

    if (separation <= totalRadius) {
      var cp = manifold.points[pointCount]; // ManifoldPoint
      cp.localPoint.set(_Transform.Transform.mulTVec2(xf2, clipPoints2[i].v));
      cp.id = clipPoints2[i].id;
      if (flip) {
        // Swap features
        var cf = cp.id.cf; // ContactFeature
        var indexA = cf.indexA;
        var indexB = cf.indexB;
        var typeA = cf.typeA;
        var typeB = cf.typeB;
        cf.indexA = indexB;
        cf.indexB = indexA;
        cf.typeA = typeB;
        cf.typeB = typeA;
      }
      ++pointCount;
    }
  }

  manifold.pointCount = pointCount;
}

/**
 * 
 * Find edge normal of max separation on A - return if separating axis is found<br>
 * Find edge normal of max separation on B - return if separation axis is found<br>
 * Choose reference edge as min(minA, minB)<br>
 * Find incident edge<br>
 * Clip
 * 
 * The normal points from 1 to 2
 */
exports.CollidePolygons = CollidePolygon_CollidePolygons;