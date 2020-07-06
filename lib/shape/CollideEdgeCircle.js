import { assert as utilcommon_assertjs } from "../util/common";
import { Transform as commonTransform_Transformjs } from "../common/Transform";
import { Vec2 as commonVec2_Vec2js } from "../common/Vec2";
import { Contact as Contact_Contactjs } from "../Contact";

import {
  e_circles as Manifoldjs_e_circles,
  e_faceA as Manifoldjs_e_faceA,
  e_vertex as Manifoldjs_e_vertex,
  e_face as Manifoldjs_e_face,
} from "../Manifold";

import { EdgeShape as EdgeShape_EdgeShapejs } from "./EdgeShape";
import { ChainShape as ChainShape_ChainShapejs } from "./ChainShape";
import { CircleShape as CircleShape_CircleShapejs } from "./CircleShape";
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

Contact_Contactjs.addType(EdgeShape_EdgeShapejs.TYPE, CircleShape_CircleShapejs.TYPE, EdgeCircleContact);
Contact_Contactjs.addType(ChainShape_ChainShapejs.TYPE, CircleShape_CircleShapejs.TYPE, ChainCircleContact);

function EdgeCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB,
    indexB) {
  _ASSERT && utilcommon_assertjs(fixtureA.getType() == EdgeShape_EdgeShapejs.TYPE);
  _ASSERT && utilcommon_assertjs(fixtureB.getType() == CircleShape_CircleShapejs.TYPE);

  var shapeA = fixtureA.getShape();
  var shapeB = fixtureB.getShape();

  CollideEdgeCircle(manifold, shapeA, xfA, shapeB, xfB);
}

function ChainCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB,
    indexB) {
  _ASSERT && utilcommon_assertjs(fixtureA.getType() == ChainShape_ChainShapejs.TYPE);
  _ASSERT && utilcommon_assertjs(fixtureB.getType() == CircleShape_CircleShapejs.TYPE);

  var chain = fixtureA.getShape();
  var edge = new EdgeShape_EdgeShapejs();
  chain.getChildEdge(edge, indexA);

  var shapeA = edge;
  var shapeB = fixtureB.getShape();

  CollideEdgeCircle(manifold, shapeA, xfA, shapeB, xfB);
}

// Compute contact points for edge versus circle.
// This accounts for edge connectivity.
function CollideEdgeCircle(manifold, edgeA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle in frame of edge
  var Q = commonTransform_Transformjs.mulTVec2(xfA, commonTransform_Transformjs.mulVec2(xfB, circleB.m_p));

  var A = edgeA.m_vertex1;
  var B = edgeA.m_vertex2;
  var e = commonVec2_Vec2js.sub(B, A);

  // Barycentric coordinates
  var u = commonVec2_Vec2js.dot(e, commonVec2_Vec2js.sub(B, Q));
  var v = commonVec2_Vec2js.dot(e, commonVec2_Vec2js.sub(Q, A));

  var radius = edgeA.m_radius + circleB.m_radius;

  // Region A
  if (v <= 0.0) {
    var P = commonVec2_Vec2js.clone(A);
    var d = commonVec2_Vec2js.sub(Q, P);
    var dd = commonVec2_Vec2js.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to A?
    if (edgeA.m_hasVertex0) {
      var A1 = edgeA.m_vertex0;
      var B1 = A;
      var e1 = commonVec2_Vec2js.sub(B1, A1);
      var u1 = commonVec2_Vec2js.dot(e1, commonVec2_Vec2js.sub(B1, Q));

      // Is the circle in Region AB of the previous edge?
      if (u1 > 0.0) {
        return;
      }
    }

    manifold.type = Manifoldjs_e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifoldjs_e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifoldjs_e_vertex;
    return;
  }

  // Region B
  if (u <= 0.0) {
    var P = commonVec2_Vec2js.clone(B);
    var d = commonVec2_Vec2js.sub(Q, P);
    var dd = commonVec2_Vec2js.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to B?
    if (edgeA.m_hasVertex3) {
      var B2 = edgeA.m_vertex3;
      var A2 = B;
      var e2 = commonVec2_Vec2js.sub(B2, A2);
      var v2 = commonVec2_Vec2js.dot(e2, commonVec2_Vec2js.sub(Q, A2));

      // Is the circle in Region AB of the next edge?
      if (v2 > 0.0) {
        return;
      }
    }

    manifold.type = Manifoldjs_e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 1;
    manifold.points[0].id.cf.typeA = Manifoldjs_e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifoldjs_e_vertex;
    return;
  }

  // Region AB
  var den = commonVec2_Vec2js.dot(e, e);
  _ASSERT && utilcommon_assertjs(den > 0.0);
  var P = commonVec2_Vec2js.combine(u / den, A, v / den, B);
  var d = commonVec2_Vec2js.sub(Q, P);
  var dd = commonVec2_Vec2js.dot(d, d);
  if (dd > radius * radius) {
    return;
  }

  var n = commonVec2_Vec2js.neo(-e.y, e.x);
  if (commonVec2_Vec2js.dot(n, commonVec2_Vec2js.sub(Q, A)) < 0.0) {
    n.set(-n.x, -n.y);
  }
  n.normalize();

  manifold.type = Manifoldjs_e_faceA;
  manifold.localNormal = n;
  manifold.localPoint.set(A);
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = Manifoldjs_e_face;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = Manifoldjs_e_vertex;
}
