var _common = require("../util/common");

var _Math = require("../common/Math");

var _Transform = require("../common/Transform");

var _Vec = require("../common/Vec2");

var _Manifold = require("../Manifold");

var _Contact = require("../Contact");

var _CircleShape = require("./CircleShape");

var _PolygonShape = require("./PolygonShape");

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

(0, _Contact.addType)(PolygonShape.TYPE, CircleShape.TYPE, PolygonCircleContact);

function PolygonCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && _common.assert.assert(fixtureA.getType() == PolygonShape.TYPE);
  _ASSERT && _common.assert.assert(fixtureB.getType() == CircleShape.TYPE);
  CollidePolygonCircle(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

function CollidePolygonCircle(manifold, polygonA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle position in the frame of the polygon.
  var c = (0, _Transform.mulVec2)(xfB, circleB.m_p);
  var cLocal = (0, _Transform.mulTVec2)(xfA, c);

  // Find the min separating edge.
  var normalIndex = 0;
  var separation = -Infinity;
  var radius = polygonA.m_radius + circleB.m_radius;
  var vertexCount = polygonA.m_count;
  var vertices = polygonA.m_vertices;
  var normals = polygonA.m_normals;

  for (var i = 0; i < vertexCount; ++i) {
    var s = (0, _Vec.dot)(normals[i], (0, _Vec.sub)(cLocal, vertices[i]));

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
  if (separation < _Math.EPSILON) {
    manifold.pointCount = 1;
    manifold.type = _Manifold.e_faceA;
    manifold.localNormal.set(normals[normalIndex]);
    manifold.localPoint.setCombine(0.5, v1, 0.5, v2);
    manifold.points[0].localPoint = circleB.m_p;

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = _Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold.e_vertex;
    return;
  }

  // Compute barycentric coordinates
  var u1 = (0, _Vec.dot)((0, _Vec.sub)(cLocal, v1), (0, _Vec.sub)(v2, v1));
  var u2 = (0, _Vec.dot)((0, _Vec.sub)(cLocal, v2), (0, _Vec.sub)(v1, v2));
  if (u1 <= 0.0) {
    if ((0, _Vec.distanceSquared)(cLocal, v1) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = _Manifold.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v1);
    manifold.localNormal.normalize();
    manifold.localPoint = v1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = _Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold.e_vertex;
  } else if (u2 <= 0.0) {
    if ((0, _Vec.distanceSquared)(cLocal, v2) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = _Manifold.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v2);
    manifold.localNormal.normalize();
    manifold.localPoint.set(v2);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = _Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold.e_vertex;
  } else {
    var faceCenter = (0, _Vec.mid)(v1, v2);
    var separation = (0, _Vec.dot)(cLocal, normals[vertIndex1]) - (0, _Vec.dot)(faceCenter, normals[vertIndex1]);
    if (separation > radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = _Manifold.e_faceA;
    manifold.localNormal.set(normals[vertIndex1]);
    manifold.localPoint.set(faceCenter);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = _Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold.e_vertex;
  }
}
