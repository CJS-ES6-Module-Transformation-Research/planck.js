"use strict";

var _common = require("../util/common");

var _Transform = require("../common/Transform");

var _Vec = require("../common/Vec2");

var _Contact = require("../Contact");

var _Manifold = require("../Manifold");

var _CircleShape = require("./CircleShape");

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

_Contact.Contact.addType(_CircleShape.CircleShape.TYPE, _CircleShape.CircleShape.TYPE, CircleCircleContact);

function CircleCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && (0, _common.assert)(fixtureA.getType() == _CircleShape.CircleShape.TYPE);
  _ASSERT && (0, _common.assert)(fixtureB.getType() == _CircleShape.CircleShape.TYPE);
  CollideCircles(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

function CollideCircles(manifold, circleA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  var pA = _Transform.Transform.mulVec2(xfA, circleA.m_p);
  var pB = _Transform.Transform.mulVec2(xfB, circleB.m_p);

  var distSqr = _Vec.Vec2.distanceSquared(pB, pA);
  var rA = circleA.m_radius;
  var rB = circleB.m_radius;
  var radius = rA + rB;
  if (distSqr > radius * radius) {
    return;
  }

  manifold.type = _Manifold.Manifold.e_circles;
  manifold.localPoint.set(circleA.m_p);
  manifold.localNormal.setZero();
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = _Manifold.Manifold.e_vertex;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = _Manifold.Manifold.e_vertex;
}

var CollideCircles;

CollideCircles = CollideCircles;