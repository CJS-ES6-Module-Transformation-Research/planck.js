"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChainShape = undefined;

var _common = require("../util/common");

var utilcommon_assertjs = _interopRequireWildcard(_common);

var _create = require("../util/create");

var _Transform = require("../common/Transform");

var _Vec = require("../common/Vec2");

var _Settings = require("../Settings");

var _Shape = require("../Shape");

var _EdgeShape = require("./EdgeShape");

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

var ChainShape_ChainShape = ChainShape;

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

ChainShape._super = _Shape.Shape;
ChainShape.prototype = (0, _create.createjs)(ChainShape._super.prototype);

ChainShape.TYPE = 'chain';

function ChainShape(vertices, loop) {
  if (!(this instanceof ChainShape)) {
    return new ChainShape(vertices, loop);
  }

  ChainShape._super.call(this);

  this.m_type = ChainShape.TYPE;
  this.m_radius = _Settings.Settings.polygonRadius;
  this.m_vertices = [];
  this.m_count = 0;
  this.m_prevVertex = null;
  this.m_nextVertex = null;
  this.m_hasPrevVertex = false;
  this.m_hasNextVertex = false;

  if (vertices && vertices.length) {
    if (loop) {
      this._createLoop(vertices);
    } else {
      this._createChain(vertices);
    }
  }
}

// ChainShape.clear = function() {
// this.m_vertices.length = 0;
// this.m_count = 0;
// }

/**
 * Create a loop. This automatically adjusts connectivity.
 * 
 * @param vertices an array of vertices, these are copied
 * @param count the vertex count
 */
ChainShape.prototype._createLoop = function (vertices) {
  _ASSERT && utilcommon_assertjs.assert(this.m_vertices.length == 0 && this.m_count == 0);
  _ASSERT && utilcommon_assertjs.assert(vertices.length >= 3);
  for (var i = 1; i < vertices.length; ++i) {
    var v1 = vertices[i - 1];
    var v2 = vertices[i];
    // If the code crashes here, it means your vertices are too close together.
    _ASSERT && utilcommon_assertjs.assert(_Vec.Vec2.distanceSquared(v1, v2) > _Settings.Settings.linearSlopSquared);
  }

  this.m_vertices.length = 0;
  this.m_count = vertices.length + 1;
  for (var i = 0; i < vertices.length; ++i) {
    this.m_vertices[i] = vertices[i].clone();
  }
  this.m_vertices[vertices.length] = vertices[0].clone();

  this.m_prevVertex = this.m_vertices[this.m_count - 2];
  this.m_nextVertex = this.m_vertices[1];
  this.m_hasPrevVertex = true;
  this.m_hasNextVertex = true;
  return this;
};

/**
 * Create a chain with isolated end vertices.
 * 
 * @param vertices an array of vertices, these are copied
 * @param count the vertex count
 */
ChainShape.prototype._createChain = function (vertices) {
  _ASSERT && utilcommon_assertjs.assert(this.m_vertices.length == 0 && this.m_count == 0);
  _ASSERT && utilcommon_assertjs.assert(vertices.length >= 2);
  for (var i = 1; i < vertices.length; ++i) {
    // If the code crashes here, it means your vertices are too close together.
    var v1 = vertices[i - 1];
    var v2 = vertices[i];
    _ASSERT && utilcommon_assertjs.assert(_Vec.Vec2.distanceSquared(v1, v2) > _Settings.Settings.linearSlopSquared);
  }

  this.m_count = vertices.length;
  for (var i = 0; i < vertices.length; ++i) {
    this.m_vertices[i] = vertices[i].clone();
  }

  this.m_hasPrevVertex = false;
  this.m_hasNextVertex = false;
  this.m_prevVertex = null;
  this.m_nextVertex = null;
  return this;
};

/**
 * Establish connectivity to a vertex that precedes the first vertex. Don't call
 * this for loops.
 */
ChainShape.prototype._setPrevVertex = function (prevVertex) {
  this.m_prevVertex = prevVertex;
  this.m_hasPrevVertex = true;
};

/**
 * Establish connectivity to a vertex that follows the last vertex. Don't call
 * this for loops.
 */
ChainShape.prototype._setNextVertex = function (nextVertex) {
  this.m_nextVertex = nextVertex;
  this.m_hasNextVertex = true;
};

/**
 * @deprecated
 */
ChainShape.prototype._clone = function () {
  var clone = new ChainShape();
  clone.createChain(this.m_vertices);
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_prevVertex = this.m_prevVertex;
  clone.m_nextVertex = this.m_nextVertex;
  clone.m_hasPrevVertex = this.m_hasPrevVertex;
  clone.m_hasNextVertex = this.m_hasNextVertex;
  return clone;
};

ChainShape.prototype.getChildCount = function () {
  // edge count = vertex count - 1
  return this.m_count - 1;
};

// Get a child edge.
ChainShape.prototype.getChildEdge = function (edge, childIndex) {
  _ASSERT && utilcommon_assertjs.assert(0 <= childIndex && childIndex < this.m_count - 1);
  edge.m_type = _EdgeShape.EdgeShape.TYPE;
  edge.m_radius = this.m_radius;

  edge.m_vertex1 = this.m_vertices[childIndex];
  edge.m_vertex2 = this.m_vertices[childIndex + 1];

  if (childIndex > 0) {
    edge.m_vertex0 = this.m_vertices[childIndex - 1];
    edge.m_hasVertex0 = true;
  } else {
    edge.m_vertex0 = this.m_prevVertex;
    edge.m_hasVertex0 = this.m_hasPrevVertex;
  }

  if (childIndex < this.m_count - 2) {
    edge.m_vertex3 = this.m_vertices[childIndex + 2];
    edge.m_hasVertex3 = true;
  } else {
    edge.m_vertex3 = this.m_nextVertex;
    edge.m_hasVertex3 = this.m_hasNextVertex;
  }
};

ChainShape.prototype.getVertex = function (index) {
  _ASSERT && utilcommon_assertjs.assert(0 <= index && index <= this.m_count);
  if (index < this.m_count) {
    return this.m_vertices[index];
  } else {
    return this.m_vertices[0];
  }
};

/**
 * This always return false.
 */
ChainShape.prototype.testPoint = function (xf, p) {
  return false;
};

ChainShape.prototype.rayCast = function (output, input, xf, childIndex) {
  _ASSERT && utilcommon_assertjs.assert(0 <= childIndex && childIndex < this.m_count);

  var edgeShape = new _EdgeShape.EdgeShape(this.getVertex(childIndex), this.getVertex(childIndex + 1));
  return edgeShape.rayCast(output, input, xf, 0);
};

ChainShape.prototype.computeAABB = function (aabb, xf, childIndex) {
  _ASSERT && utilcommon_assertjs.assert(0 <= childIndex && childIndex < this.m_count);

  var v1 = _Transform.Transform.mulVec2(xf, this.getVertex(childIndex));
  var v2 = _Transform.Transform.mulVec2(xf, this.getVertex(childIndex + 1));

  aabb.combinePoints(v1, v2);
};

/**
 * Chains have zero mass.
 */
ChainShape.prototype.computeMass = function (massData, density) {
  massData.mass = 0.0;
  massData.center = _Vec.Vec2.neo();
  massData.I = 0.0;
};

ChainShape.prototype.computeDistanceProxy = function (proxy, childIndex) {
  _ASSERT && utilcommon_assertjs.assert(0 <= childIndex && childIndex < this.m_count);
  proxy.m_buffer[0] = this.getVertex(childIndex);
  proxy.m_buffer[1] = this.getVertex(childIndex + 1);
  proxy.m_vertices = proxy.m_buffer;
  proxy.m_count = 2;
  proxy.m_radius = this.m_radius;
};

/**
 * A chain shape is a free form sequence of line segments. The chain has
 * two-sided collision, so you can use inside and outside collision. Therefore,
 * you may use any winding order. Connectivity information is used to create
 * smooth collisions.
 * 
 * WARNING: The chain will not collide properly if there are self-intersections.
 */
exports.ChainShape = ChainShape_ChainShape;