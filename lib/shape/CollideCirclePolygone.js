import { assert as utilcommon_assertjs } from "../util/common";
import { math as commonMath_mathjs } from "../common/Math";
import { Transform as commonTransform_Transformjs } from "../common/Transform";
import { Vec2 as commonVec2_Vec2js } from "../common/Vec2";
import { Manifold as Manifold_Manifoldjs } from "../Manifold";
import { Contact as Contact_Contactjs } from "../Contact";
import { CircleShape as CircleShape_CircleShapejs } from "./CircleShape";
import { PolygonShape as PolygonShape_PolygonShapejs } from "./PolygonShape";
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

Contact_Contactjs.addType(PolygonShape_PolygonShapejs.TYPE, CircleShape_CircleShapejs.TYPE, PolygonCircleContact);

function PolygonCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && utilcommon_assertjs(fixtureA.getType() == PolygonShape_PolygonShapejs.TYPE);
  _ASSERT && utilcommon_assertjs(fixtureB.getType() == CircleShape_CircleShapejs.TYPE);
  CollidePolygonCircle(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(),
      xfB);
}

function CollidePolygonCircle(manifold, polygonA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle position in the frame of the polygon.
  var c = commonTransform_Transformjs.mulVec2(xfB, circleB.m_p);
  var cLocal = commonTransform_Transformjs.mulTVec2(xfA, c);

  // Find the min separating edge.
  var normalIndex = 0;
  var separation = -Infinity;
  var radius = polygonA.m_radius + circleB.m_radius;
  var vertexCount = polygonA.m_count;
  var vertices = polygonA.m_vertices;
  var normals = polygonA.m_normals;

  for (var i = 0; i < vertexCount; ++i) {
    var s = commonVec2_Vec2js.dot(normals[i], commonVec2_Vec2js.sub(cLocal, vertices[i]));

    if (s > radius) {
      // Early out.
      return;
    }

    if (s > separation) {
      separation = s;
      normalIndex = i;
    }
  }

  // Vertices that subtend the incident face.
  var vertIndex1 = normalIndex;
  var vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
  var v1 = vertices[vertIndex1];
  var v2 = vertices[vertIndex2];

  // If the center is inside the polygon ...
  if (separation < commonMath_mathjs.EPSILON) {
    manifold.pointCount = 1;
    manifold.type = Manifold_Manifoldjs.e_faceA;
    manifold.localNormal.set(normals[normalIndex]);
    manifold.localPoint.setCombine(0.5, v1, 0.5, v2);
    manifold.points[0].localPoint = circleB.m_p;

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold_Manifoldjs.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold_Manifoldjs.e_vertex;
    return;
  }

  // Compute barycentric coordinates
  var u1 = commonVec2_Vec2js.dot(commonVec2_Vec2js.sub(cLocal, v1), commonVec2_Vec2js.sub(v2, v1));
  var u2 = commonVec2_Vec2js.dot(commonVec2_Vec2js.sub(cLocal, v2), commonVec2_Vec2js.sub(v1, v2));
  if (u1 <= 0.0) {
    if (commonVec2_Vec2js.distanceSquared(cLocal, v1) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold_Manifoldjs.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v1);
    manifold.localNormal.normalize();
    manifold.localPoint = v1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold_Manifoldjs.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold_Manifoldjs.e_vertex;
  } else if (u2 <= 0.0) {
    if (commonVec2_Vec2js.distanceSquared(cLocal, v2) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold_Manifoldjs.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v2);
    manifold.localNormal.normalize();
    manifold.localPoint.set(v2);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold_Manifoldjs.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold_Manifoldjs.e_vertex;
  } else {
    var faceCenter = commonVec2_Vec2js.mid(v1, v2);
    var separation = commonVec2_Vec2js.dot(cLocal, normals[vertIndex1])
        - commonVec2_Vec2js.dot(faceCenter, normals[vertIndex1]);
    if (separation > radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold_Manifoldjs.e_faceA;
    manifold.localNormal.set(normals[vertIndex1]);
    manifold.localPoint.set(faceCenter);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold_Manifoldjs.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold_Manifoldjs.e_vertex;
  }
}
