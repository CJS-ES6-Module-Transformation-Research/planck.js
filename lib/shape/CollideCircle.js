Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollideCircles = CollideCircles;

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

var _Settings = require("../Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _Shape = require("../Shape");

var _Shape2 = _interopRequireDefault(_Shape);

var _Contact = require("../Contact");

var _Contact2 = _interopRequireDefault(_Contact);

var _Manifold = require("../Manifold");

var _Manifold2 = _interopRequireDefault(_Manifold);

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

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

_Contact2.default.addType(_CircleShape2.default.TYPE, _CircleShape2.default.TYPE, CircleCircleContact);

function CircleCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == _CircleShape2.default.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == _CircleShape2.default.TYPE);
  CollideCircles(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

function CollideCircles(manifold, circleA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  var pA = _Transform2.default.mulVec2(xfA, circleA.m_p);
  var pB = _Transform2.default.mulVec2(xfB, circleB.m_p);

  var distSqr = _Vec2.default.distanceSquared(pB, pA);
  var rA = circleA.m_radius;
  var rB = circleB.m_radius;
  var radius = rA + rB;
  if (distSqr > radius * radius) {
    return;
  }

  manifold.type = _Manifold2.default.e_circles;
  manifold.localPoint.set(circleA.m_p);
  manifold.localNormal.setZero();
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = _Manifold2.default.e_vertex;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = _Manifold2.default.e_vertex;
}
