import { assert as CollidePolygon_common } from "../util/common";

import {
  Transform as CollidePolygon_Transform,
  mulVec2 as Transformjs_mulVec2,
  mulTVec2 as Transformjs_mulTVec2,
  mulTXf as Transformjs_mulTXf,
} from "../common/Transform";

import { Rot as CollidePolygon_Rot, mulVec2 as Rotjs_mulVec2, mulT as Rotjs_mulT } from "../common/Rot";

import {
  Vec2 as CollidePolygon_Vec2,
  dot as Vec2js_dot,
  cross as Vec2js_cross,
  combine as Vec2js_combine,
  sub as Vec2js_sub,
  neg as Vec2js_neg,
} from "../common/Vec2";

import {
  Manifold as CollidePolygon_Manifold,
  e_faceA as Manifoldjs_e_faceA,
  e_faceB as Manifoldjs_e_faceB,
  e_vertex as Manifoldjs_e_vertex,
  e_face as Manifoldjs_e_face,
} from "../Manifold";

import { Contact as CollidePolygon_Contact, addType as Contactjs_addType } from "../Contact";
import { PolygonShape as CollidePolygon_PolygonShape } from "./PolygonShape";
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

Contactjs_addType(PolygonShape.TYPE, PolygonShape.TYPE, PolygonContact);

function PolygonContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common(fixtureA.getType() == PolygonShape.TYPE);
  _ASSERT && common(fixtureB.getType() == PolygonShape.TYPE);
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
  var xf = Transformjs_mulTXf(xf2, xf1);

  var bestIndex = 0;
  var maxSeparation = -Infinity;
  for (var i = 0; i < count1; ++i) {
    // Get poly1 normal in frame2.
    var n = Rotjs_mulVec2(xf.q, n1s[i]);
    var v1 = Transformjs_mulVec2(xf, v1s[i]);

    // Find deepest point for normal i.
    var si = Infinity;
    for (var j = 0; j < count2; ++j) {
      var sij = Vec2js_dot(n, v2s[j]) - Vec2js_dot(n, v1);
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

  _ASSERT && common(0 <= edge1 && edge1 < poly1.m_count);

  // Get the normal of the reference edge in poly2's frame.
  var normal1 = Rotjs_mulT(xf2.q, Rotjs_mulVec2(xf1.q, normals1[edge1]));

  // Find the incident edge on poly2.
  var index = 0;
  var minDot = Infinity;
  for (var i = 0; i < count2; ++i) {
    var dot = Vec2js_dot(normal1, normals2[i]);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }

  // Build the clip vertices for the incident edge.
  var i1 = index;
  var i2 = i1 + 1 < count2 ? i1 + 1 : 0;

  c[0].v = Transformjs_mulVec2(xf2, vertices2[i1]);
  c[0].id.cf.indexA = edge1;
  c[0].id.cf.indexB = i1;
  c[0].id.cf.typeA = Manifoldjs_e_face;
  c[0].id.cf.typeB = Manifoldjs_e_vertex;

  c[1].v = Transformjs_mulVec2(xf2, vertices2[i2]);
  c[1].id.cf.indexA = edge1;
  c[1].id.cf.indexB = i2;
  c[1].id.cf.typeA = Manifoldjs_e_face;
  c[1].id.cf.typeB = Manifoldjs_e_vertex;
}

function CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
  manifold.pointCount = 0;
  var totalRadius = polyA.m_radius + polyB.m_radius;

  FindMaxSeparation(polyA, xfA, polyB, xfB);
  var edgeA = FindMaxSeparation._bestIndex;
  var separationA = FindMaxSeparation._maxSeparation;
  if (separationA > totalRadius)
    return;

  FindMaxSeparation(polyB, xfB, polyA, xfA);
  var edgeB = FindMaxSeparation._bestIndex;
  var separationB = FindMaxSeparation._maxSeparation;
  if (separationB > totalRadius)
    return;

  var poly1; // reference polygon
  var poly2; // incident polygon
  var xf1;
  var xf2;
  var edge1; // reference edge
  var flip;
  var k_tol = 0.1 * Settings;

  if (separationB > separationA + k_tol) {
    poly1 = polyB;
    poly2 = polyA;
    xf1 = xfB;
    xf2 = xfA;
    edge1 = edgeB;
    manifold.type = Manifoldjs_e_faceB;
    flip = 1;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    xf1 = xfA;
    xf2 = xfB;
    edge1 = edgeA;
    manifold.type = Manifoldjs_e_faceA;
    flip = 0;
  }

  var incidentEdge = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

  var count1 = poly1.m_count;
  var vertices1 = poly1.m_vertices;

  var iv1 = edge1;
  var iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;

  var v11 = vertices1[iv1];
  var v12 = vertices1[iv2];

  var localTangent = Vec2js_sub(v12, v11);
  localTangent.normalize();

  var localNormal = Vec2js_cross(localTangent, 1.0);
  var planePoint = Vec2js_combine(0.5, v11, 0.5, v12);

  var tangent = Rotjs_mulVec2(xf1.q, localTangent);
  var normal = Vec2js_cross(tangent, 1.0);

  v11 = Transformjs_mulVec2(xf1, v11);
  v12 = Transformjs_mulVec2(xf1, v12);

  // Face offset.
  var frontOffset = Vec2js_dot(normal, v11);

  // Side offsets, extended by polytope skin thickness.
  var sideOffset1 = -Vec2js_dot(tangent, v11) + totalRadius;
  var sideOffset2 = Vec2js_dot(tangent, v12) + totalRadius;

  // Clip incident edge against extruded edge1 side edges.
  var clipPoints1 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  var clipPoints2 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  var np;

  // Clip to box side 1
  np = Manifold.clipSegmentToLine(clipPoints1, incidentEdge, Vec2js_neg(tangent),
      sideOffset1, iv1);

  if (np < 2) {
    return;
  }

  // Clip to negative box side 1
  np = Manifold.clipSegmentToLine(clipPoints2, clipPoints1, tangent,
      sideOffset2, iv2);

  if (np < 2) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  manifold.localNormal = localNormal;
  manifold.localPoint = planePoint;

  var pointCount = 0;
  for (var i = 0; i < clipPoints2.length/* maxManifoldPoints */; ++i) {
    var separation = Vec2js_dot(normal, clipPoints2[i].v) - frontOffset;

    if (separation <= totalRadius) {
      var cp = manifold.points[pointCount]; // ManifoldPoint
      cp.localPoint.set(Transformjs_mulTVec2(xf2, clipPoints2[i].v));
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
var exported_CollidePolygons = CollidePolygons;

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
export { exported_CollidePolygons as CollidePolygons };
