import { assert as utilcommon_assertjs } from "../util/common";
import { Transform as commonTransform_Transformjs } from "../common/Transform";
import { Vec2 as commonVec2_Vec2js } from "../common/Vec2";
import { Rot as commonRot_Rotjs } from "../common/Rot";

import {
  maxManifoldPoints as Settingsjs_maxManifoldPoints,
  angularSlop as Settingsjs_angularSlop,
  polygonRadius as Settingsjs_polygonRadius,
} from "../Settings";

import { Contact as Contact_Contactjs } from "../Contact";

import {
  e_faceA as Manifoldjs_e_faceA,
  e_faceB as Manifoldjs_e_faceB,
  e_vertex as Manifoldjs_e_vertex,
  e_face as Manifoldjs_e_face,
  clipSegmentToLine as Manifoldjs_clipSegmentToLine,
  clipVertex as Manifoldjs_clipVertex,
} from "../Manifold";

import { EdgeShape as EdgeShape_EdgeShapejs } from "./EdgeShape";
import { ChainShape as ChainShape_ChainShapejs } from "./ChainShape";
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

Contact_Contactjs.addType(EdgeShape_EdgeShapejs.TYPE, PolygonShape_PolygonShapejs.TYPE, EdgePolygonContact);
Contact_Contactjs.addType(ChainShape_ChainShapejs.TYPE, PolygonShape_PolygonShapejs.TYPE, ChainPolygonContact);

function EdgePolygonContact(manifold, xfA, fA, indexA, xfB, fB, indexB) {
  _ASSERT && utilcommon_assertjs(fA.getType() == EdgeShape_EdgeShapejs.TYPE);
  _ASSERT && utilcommon_assertjs(fB.getType() == PolygonShape_PolygonShapejs.TYPE);

  CollideEdgePolygon(manifold, fA.getShape(), xfA, fB.getShape(), xfB);
}

function ChainPolygonContact(manifold, xfA, fA, indexA, xfB, fB, indexB) {
  _ASSERT && utilcommon_assertjs(fA.getType() == ChainShape_ChainShapejs.TYPE);
  _ASSERT && utilcommon_assertjs(fB.getType() == PolygonShape_PolygonShapejs.TYPE);

  var chain = fA.getShape();
  var edge = new EdgeShape_EdgeShapejs();
  chain.getChildEdge(edge, indexA);

  CollideEdgePolygon(manifold, edge, xfA, fB.getShape(), xfB);
}

// EPAxis Type
var e_unknown = -1;
var e_edgeA = 1;
var e_edgeB = 2;

// VertexType unused?
var e_isolated = 0;
var e_concave = 1;
var e_convex = 2;

// This structure is used to keep track of the best separating axis.
function EPAxis() {
  this.type; // Type
  this.index;
  this.separation;
}

// This holds polygon B expressed in frame A.
function TempPolygon() {
  this.vertices = []; // Vec2[Settings.maxPolygonVertices]
  this.normals = []; // Vec2[Settings.maxPolygonVertices];
  this.count = 0;
}

// Reference face used for clipping
function ReferenceFace() {
  this.i1, this.i2; // int
  this.v1, this.v2; // v
  this.normal = commonVec2_Vec2js.zero();
  this.sideNormal1 = commonVec2_Vec2js.zero();
  this.sideOffset1; // float
  this.sideNormal2 = commonVec2_Vec2js.zero();
  this.sideOffset2; // float
}

// reused
var edgeAxis = new EPAxis();
var polygonAxis = new EPAxis();
var polygonBA = new TempPolygon();
var rf = new ReferenceFace();

/**
 * This function collides and edge and a polygon, taking into account edge
 * adjacency.
 */
function CollideEdgePolygon(manifold, edgeA, xfA, polygonB, xfB) {
  // Algorithm:
  // 1. Classify v1 and v2
  // 2. Classify polygon centroid as front or back
  // 3. Flip normal if necessary
  // 4. Initialize normal range to [-pi, pi] about face normal
  // 5. Adjust normal range according to adjacent edges
  // 6. Visit each separating axes, only accept axes within the range
  // 7. Return if _any_ axis indicates separation
  // 8. Clip

  var m_type1, m_type2; // VertexType unused?

  var xf = commonTransform_Transformjs.mulTXf(xfA, xfB);

  var centroidB = commonTransform_Transformjs.mulVec2(xf, polygonB.m_centroid);

  var v0 = edgeA.m_vertex0;
  var v1 = edgeA.m_vertex1;
  var v2 = edgeA.m_vertex2;
  var v3 = edgeA.m_vertex3;

  var hasVertex0 = edgeA.m_hasVertex0;
  var hasVertex3 = edgeA.m_hasVertex3;

  var edge1 = commonVec2_Vec2js.sub(v2, v1);
  edge1.normalize();
  var normal1 = commonVec2_Vec2js.neo(edge1.y, -edge1.x);
  var offset1 = commonVec2_Vec2js.dot(normal1, commonVec2_Vec2js.sub(centroidB, v1));
  var offset0 = 0.0;
  var offset2 = 0.0;
  var convex1 = false;
  var convex2 = false;

  // Is there a preceding edge?
  if (hasVertex0) {
    var edge0 = commonVec2_Vec2js.sub(v1, v0);
    edge0.normalize();
    var normal0 = commonVec2_Vec2js.neo(edge0.y, -edge0.x);
    convex1 = commonVec2_Vec2js.cross(edge0, edge1) >= 0.0;
    offset0 = commonVec2_Vec2js.dot(normal0, centroidB) - commonVec2_Vec2js.dot(normal0, v0);
  }

  // Is there a following edge?
  if (hasVertex3) {
    var edge2 = commonVec2_Vec2js.sub(v3, v2);
    edge2.normalize();
    var normal2 = commonVec2_Vec2js.neo(edge2.y, -edge2.x);
    convex2 = commonVec2_Vec2js.cross(edge1, edge2) > 0.0;
    offset2 = commonVec2_Vec2js.dot(normal2, centroidB) - commonVec2_Vec2js.dot(normal2, v2);
  }

  var front;
  var normal = commonVec2_Vec2js.zero();
  var lowerLimit = commonVec2_Vec2js.zero();
  var upperLimit = commonVec2_Vec2js.zero();

  // Determine front or back collision. Determine collision normal limits.
  if (hasVertex0 && hasVertex3) {
    if (convex1 && convex2) {
      front = offset0 >= 0.0 || offset1 >= 0.0 || offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.setMul(-1, normal1);
      }
    } else if (convex1) {
      front = offset0 >= 0.0 || (offset1 >= 0.0 && offset2 >= 0.0);
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.setMul(-1, normal1);
      }
    } else if (convex2) {
      front = offset2 >= 0.0 || (offset0 >= 0.0 && offset1 >= 0.0);
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.setMul(-1, normal0);
      }
    } else {
      front = offset0 >= 0.0 && offset1 >= 0.0 && offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.setMul(-1, normal0);
      }
    }
  } else if (hasVertex0) {
    if (convex1) {
      front = offset0 >= 0.0 || offset1 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.setMul(-1, normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal1);
      }
    } else {
      front = offset0 >= 0.0 && offset1 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal0);
      }
    }
  } else if (hasVertex3) {
    if (convex2) {
      front = offset1 >= 0.0 || offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal1);
      }
    } else {
      front = offset1 >= 0.0 && offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.set(normal1);
      }
    }
  } else {
    front = offset1 >= 0.0;
    if (front) {
      normal.set(normal1);
      lowerLimit.setMul(-1, normal1);
      upperLimit.setMul(-1, normal1);
    } else {
      normal.setMul(-1, normal1);
      lowerLimit.set(normal1);
      upperLimit.set(normal1);
    }
  }

  // Get polygonB in frameA
  polygonBA.count = polygonB.m_count;
  for (var i = 0; i < polygonB.m_count; ++i) {
    polygonBA.vertices[i] = commonTransform_Transformjs.mulVec2(xf, polygonB.m_vertices[i]);
    polygonBA.normals[i] = commonRot_Rotjs.mulVec2(xf.q, polygonB.m_normals[i]);
  }

  var radius = 2.0 * Settingsjs_polygonRadius;

  manifold.pointCount = 0;

  { // ComputeEdgeSeparation
    edgeAxis.type = e_edgeA;
    edgeAxis.index = front ? 0 : 1;
    edgeAxis.separation = Infinity;

    for (var i = 0; i < polygonBA.count; ++i) {
      var s = commonVec2_Vec2js.dot(normal, commonVec2_Vec2js.sub(polygonBA.vertices[i], v1));
      if (s < edgeAxis.separation) {
        edgeAxis.separation = s;
      }
    }
  }

  // If no valid normal can be found than this edge should not collide.
  if (edgeAxis.type == e_unknown) {
    return;
  }

  if (edgeAxis.separation > radius) {
    return;
  }

  { // ComputePolygonSeparation
    polygonAxis.type = e_unknown;
    polygonAxis.index = -1;
    polygonAxis.separation = -Infinity;

    var perp = commonVec2_Vec2js.neo(-normal.y, normal.x);

    for (var i = 0; i < polygonBA.count; ++i) {
      var n = commonVec2_Vec2js.neg(polygonBA.normals[i]);

      var s1 = commonVec2_Vec2js.dot(n, commonVec2_Vec2js.sub(polygonBA.vertices[i], v1));
      var s2 = commonVec2_Vec2js.dot(n, commonVec2_Vec2js.sub(polygonBA.vertices[i], v2));
      var s = commonMath_mathjs.min(s1, s2);

      if (s > radius) {
        // No collision
        polygonAxis.type = e_edgeB;
        polygonAxis.index = i;
        polygonAxis.separation = s;
        break;
      }

      // Adjacency
      if (commonVec2_Vec2js.dot(n, perp) >= 0.0) {
        if (commonVec2_Vec2js.dot(commonVec2_Vec2js.sub(n, upperLimit), normal) < -Settingsjs_angularSlop) {
          continue;
        }
      } else {
        if (commonVec2_Vec2js.dot(commonVec2_Vec2js.sub(n, lowerLimit), normal) < -Settingsjs_angularSlop) {
          continue;
        }
      }

      if (s > polygonAxis.separation) {
        polygonAxis.type = e_edgeB;
        polygonAxis.index = i;
        polygonAxis.separation = s;
      }
    }
  }

  if (polygonAxis.type != e_unknown && polygonAxis.separation > radius) {
    return;
  }

  // Use hysteresis for jitter reduction.
  var k_relativeTol = 0.98;
  var k_absoluteTol = 0.001;

  var primaryAxis;
  if (polygonAxis.type == e_unknown) {
    primaryAxis = edgeAxis;
  } else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
    primaryAxis = polygonAxis;
  } else {
    primaryAxis = edgeAxis;
  }

  var ie = [ new Manifoldjs_clipVertex(), new Manifoldjs_clipVertex() ];

  if (primaryAxis.type == e_edgeA) {
    manifold.type = Manifoldjs_e_faceA;

    // Search for the polygon normal that is most anti-parallel to the edge
    // normal.
    var bestIndex = 0;
    var bestValue = commonVec2_Vec2js.dot(normal, polygonBA.normals[0]);
    for (var i = 1; i < polygonBA.count; ++i) {
      var value = commonVec2_Vec2js.dot(normal, polygonBA.normals[i]);
      if (value < bestValue) {
        bestValue = value;
        bestIndex = i;
      }
    }

    var i1 = bestIndex;
    var i2 = i1 + 1 < polygonBA.count ? i1 + 1 : 0;

    ie[0].v = polygonBA.vertices[i1];
    ie[0].id.cf.indexA = 0;
    ie[0].id.cf.indexB = i1;
    ie[0].id.cf.typeA = Manifoldjs_e_face;
    ie[0].id.cf.typeB = Manifoldjs_e_vertex;

    ie[1].v = polygonBA.vertices[i2];
    ie[1].id.cf.indexA = 0;
    ie[1].id.cf.indexB = i2;
    ie[1].id.cf.typeA = Manifoldjs_e_face;
    ie[1].id.cf.typeB = Manifoldjs_e_vertex;

    if (front) {
      rf.i1 = 0;
      rf.i2 = 1;
      rf.v1 = v1;
      rf.v2 = v2;
      rf.normal.set(normal1);
    } else {
      rf.i1 = 1;
      rf.i2 = 0;
      rf.v1 = v2;
      rf.v2 = v1;
      rf.normal.setMul(-1, normal1);
    }
  } else {
    manifold.type = Manifoldjs_e_faceB;

    ie[0].v = v1;
    ie[0].id.cf.indexA = 0;
    ie[0].id.cf.indexB = primaryAxis.index;
    ie[0].id.cf.typeA = Manifoldjs_e_vertex;
    ie[0].id.cf.typeB = Manifoldjs_e_face;

    ie[1].v = v2;
    ie[1].id.cf.indexA = 0;
    ie[1].id.cf.indexB = primaryAxis.index;
    ie[1].id.cf.typeA = Manifoldjs_e_vertex;
    ie[1].id.cf.typeB = Manifoldjs_e_face;

    rf.i1 = primaryAxis.index;
    rf.i2 = rf.i1 + 1 < polygonBA.count ? rf.i1 + 1 : 0;
    rf.v1 = polygonBA.vertices[rf.i1];
    rf.v2 = polygonBA.vertices[rf.i2];
    rf.normal.set(polygonBA.normals[rf.i1]);
  }

  rf.sideNormal1.set(rf.normal.y, -rf.normal.x);
  rf.sideNormal2.setMul(-1, rf.sideNormal1);
  rf.sideOffset1 = commonVec2_Vec2js.dot(rf.sideNormal1, rf.v1);
  rf.sideOffset2 = commonVec2_Vec2js.dot(rf.sideNormal2, rf.v2);

  // Clip incident edge against extruded edge1 side edges.
  var clipPoints1 = [ new Manifoldjs_clipVertex(), new Manifoldjs_clipVertex() ];
  var clipPoints2 = [ new Manifoldjs_clipVertex(), new Manifoldjs_clipVertex() ];

  var np;

  // Clip to box side 1
  np = Manifoldjs_clipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);

  if (np < Settingsjs_maxManifoldPoints) {
    return;
  }

  // Clip to negative box side 1
  np = Manifoldjs_clipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);

  if (np < Settingsjs_maxManifoldPoints) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  if (primaryAxis.type == e_edgeA) {
    manifold.localNormal = commonVec2_Vec2js.clone(rf.normal);
    manifold.localPoint = commonVec2_Vec2js.clone(rf.v1);
  } else {
    manifold.localNormal = commonVec2_Vec2js.clone(polygonB.m_normals[rf.i1]);
    manifold.localPoint = commonVec2_Vec2js.clone(polygonB.m_vertices[rf.i1]);
  }

  var pointCount = 0;
  for (var i = 0; i < Settingsjs_maxManifoldPoints; ++i) {
    var separation = commonVec2_Vec2js.dot(rf.normal, commonVec2_Vec2js.sub(clipPoints2[i].v, rf.v1));

    if (separation <= radius) {
      var cp = manifold.points[pointCount]; // ManifoldPoint

      if (primaryAxis.type == e_edgeA) {
        cp.localPoint = commonTransform_Transformjs.mulT(xf, clipPoints2[i].v);
        cp.id = clipPoints2[i].id;
      } else {
        cp.localPoint = clipPoints2[i].v;
        cp.id.cf.typeA = clipPoints2[i].id.cf.typeB;
        cp.id.cf.typeB = clipPoints2[i].id.cf.typeA;
        cp.id.cf.indexA = clipPoints2[i].id.cf.indexB;
        cp.id.cf.indexB = clipPoints2[i].id.cf.indexA;
      }

      ++pointCount;
    }
  }

  manifold.pointCount = pointCount;
}
