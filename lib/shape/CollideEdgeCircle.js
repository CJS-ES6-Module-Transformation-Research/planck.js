Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._ASSERT = exports._DEBUG = undefined;

var _common = require("../util/common");

var common = _interopRequireWildcard(_common);

var _create = require("../util/create");

var _create2 = _interopRequireDefault(_create);

var _Math = require("../common/Math");

var _Math2 = _interopRequireDefault(_Math);

var _Transform = require("../common/Transform");

var _Transform2 = _interopRequireDefault(_Transform);

var _Vec = require("../common/Vec2");

var _Vec2 = _interopRequireDefault(_Vec);

var _Rot = require("../common/Rot");

var _Rot2 = _interopRequireDefault(_Rot);

var _Settings = require("../Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _Shape = require("../Shape");

var _Shape2 = _interopRequireDefault(_Shape);

var _Contact = require("../Contact");

var _Contact2 = _interopRequireDefault(_Contact);

var _Manifold = require("../Manifold");

var _Manifold2 = _interopRequireDefault(_Manifold);

var _EdgeShape = require("./EdgeShape");

var _EdgeShape2 = _interopRequireDefault(_EdgeShape);

var _ChainShape = require("./ChainShape");

var _ChainShape2 = _interopRequireDefault(_ChainShape);

var _CircleShape = require("./CircleShape");

var _CircleShape2 = _interopRequireDefault(_CircleShape);

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

var _DEBUG = exports._DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;

var _ASSERT = exports._ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

_Contact2.default.addType(_EdgeShape2.default.TYPE, _CircleShape2.default.TYPE, EdgeCircleContact);
_Contact2.default.addType(_ChainShape2.default.TYPE, _CircleShape2.default.TYPE, ChainCircleContact);

function EdgeCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == _EdgeShape2.default.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == _CircleShape2.default.TYPE);

  var shapeA = fixtureA.getShape();
  var shapeB = fixtureB.getShape();

  CollideEdgeCircle(manifold, shapeA, xfA, shapeB, xfB);
}

function ChainCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == _ChainShape2.default.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == _CircleShape2.default.TYPE);

  var chain = fixtureA.getShape();
  var edge = new _EdgeShape2.default();
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
  var Q = _Transform2.default.mulTVec2(xfA, _Transform2.default.mulVec2(xfB, circleB.m_p));

  var A = edgeA.m_vertex1;
  var B = edgeA.m_vertex2;
  var e = _Vec2.default.sub(B, A);

  // Barycentric coordinates
  var u = _Vec2.default.dot(e, _Vec2.default.sub(B, Q));
  var v = _Vec2.default.dot(e, _Vec2.default.sub(Q, A));

  var radius = edgeA.m_radius + circleB.m_radius;

  // Region A
  if (v <= 0.0) {
    var P = _Vec2.default.clone(A);
    var d = _Vec2.default.sub(Q, P);
    var dd = _Vec2.default.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to A?
    if (edgeA.m_hasVertex0) {
      var A1 = edgeA.m_vertex0;
      var B1 = A;
      var e1 = _Vec2.default.sub(B1, A1);
      var u1 = _Vec2.default.dot(e1, _Vec2.default.sub(B1, Q));

      // Is the circle in Region AB of the previous edge?
      if (u1 > 0.0) {
        return;
      }
    }

    manifold.type = _Manifold2.default.e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = _Manifold2.default.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold2.default.e_vertex;
    return;
  }

  // Region B
  if (u <= 0.0) {
    var P = _Vec2.default.clone(B);
    var d = _Vec2.default.sub(Q, P);
    var dd = _Vec2.default.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to B?
    if (edgeA.m_hasVertex3) {
      var B2 = edgeA.m_vertex3;
      var A2 = B;
      var e2 = _Vec2.default.sub(B2, A2);
      var v2 = _Vec2.default.dot(e2, _Vec2.default.sub(Q, A2));

      // Is the circle in Region AB of the next edge?
      if (v2 > 0.0) {
        return;
      }
    }

    manifold.type = _Manifold2.default.e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 1;
    manifold.points[0].id.cf.typeA = _Manifold2.default.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = _Manifold2.default.e_vertex;
    return;
  }

  // Region AB
  var den = _Vec2.default.dot(e, e);
  _ASSERT && common.assert(den > 0.0);
  var P = _Vec2.default.combine(u / den, A, v / den, B);
  var d = _Vec2.default.sub(Q, P);
  var dd = _Vec2.default.dot(d, d);
  if (dd > radius * radius) {
    return;
  }

  var n = _Vec2.default.neo(-e.y, e.x);
  if (_Vec2.default.dot(n, _Vec2.default.sub(Q, A)) < 0.0) {
    n.set(-n.x, -n.y);
  }
  n.normalize();

  manifold.type = _Manifold2.default.e_faceA;
  manifold.localNormal = n;
  manifold.localPoint.set(A);
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = _Manifold2.default.e_face;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = _Manifold2.default.e_vertex;
}
