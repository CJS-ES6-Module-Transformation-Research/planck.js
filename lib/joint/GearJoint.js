Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GearJoint;

var _common = require("../util/common");

var common = _interopRequireWildcard(_common);

var _options = require("../util/options");

var _options2 = _interopRequireDefault(_options);

var _create = require("../util/create");

var _create2 = _interopRequireDefault(_create);

var _Settings = require("../Settings");

var _Settings2 = _interopRequireDefault(_Settings);

var _Math = require("../common/Math");

var _Math2 = _interopRequireDefault(_Math);

var _Vec = require("../common/Vec2");

var _Vec2 = _interopRequireDefault(_Vec);

var _Vec3 = require("../common/Vec3");

var _Vec4 = _interopRequireDefault(_Vec3);

var _Mat = require("../common/Mat22");

var _Mat2 = _interopRequireDefault(_Mat);

var _Mat3 = require("../common/Mat33");

var _Mat4 = _interopRequireDefault(_Mat3);

var _Rot = require("../common/Rot");

var _Rot2 = _interopRequireDefault(_Rot);

var _Sweep = require("../common/Sweep");

var _Sweep2 = _interopRequireDefault(_Sweep);

var _Transform = require("../common/Transform");

var _Transform2 = _interopRequireDefault(_Transform);

var _Velocity = require("../common/Velocity");

var _Velocity2 = _interopRequireDefault(_Velocity);

var _Position = require("../common/Position");

var _Position2 = _interopRequireDefault(_Position);

var _Joint = require("../Joint");

var _Joint2 = _interopRequireDefault(_Joint);

var _RevoluteJoint = require("./RevoluteJoint");

var _RevoluteJoint2 = _interopRequireDefault(_RevoluteJoint);

var _PrismaticJoint = require("./PrismaticJoint");

var _PrismaticJoint2 = _interopRequireDefault(_PrismaticJoint);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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

GearJoint.TYPE = 'gear-joint';

GearJoint._super = _Joint2.default;
GearJoint.prototype = (0, _create2.default)(GearJoint._super.prototype);

/**
 * @typedef {Object} GearJointDef
 *
 * Gear joint definition.
 *
 * @prop {float} ratio The gear ratio. See GearJoint for explanation.
 *
 * @prop {RevoluteJoint|PrismaticJoint} joint1 The first revolute/prismatic
 *          joint attached to the gear joint.
 * @prop {PrismaticJoint|RevoluteJoint} joint2 The second prismatic/revolute
 *          joint attached to the gear joint.
 */

var DEFAULTS = {
  ratio: 1.0
};

/**
 * A gear joint is used to connect two joints together. Either joint can be a
 * revolute or prismatic joint. You specify a gear ratio to bind the motions
 * together: coordinate1 + ratio * coordinate2 = constant
 * 
 * The ratio can be negative or positive. If one joint is a revolute joint and
 * the other joint is a prismatic joint, then the ratio will have units of
 * length or units of 1/length. Warning: You have to manually destroy the gear
 * joint if joint1 or joint2 is destroyed.
 * 
 * This definition requires two existing revolute or prismatic joints (any
 * combination will work).
 *
 * @param {GearJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function GearJoint(def, bodyA, bodyB, joint1, joint2, ratio) {
  if (!(this instanceof GearJoint)) {
    return new GearJoint(def, bodyA, bodyB, joint1, joint2, ratio);
  }

  def = (0, _options2.default)(def, DEFAULTS);
  _Joint2.default.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = GearJoint.TYPE;

  _ASSERT && common.assert(joint1.m_type === _RevoluteJoint2.default.TYPE || joint1.m_type === _PrismaticJoint2.default.TYPE);
  _ASSERT && common.assert(joint2.m_type === _RevoluteJoint2.default.TYPE || joint2.m_type === _PrismaticJoint2.default.TYPE);

  this.m_joint1 = joint1 ? joint1 : def.joint1;
  this.m_joint2 = joint2 ? joint2 : def.joint2;
  this.m_ratio = _Math2.default.isFinite(ratio) ? ratio : def.ratio;

  this.m_type1 = this.m_joint1.getType();
  this.m_type2 = this.m_joint2.getType();

  // joint1 connects body A to body C
  // joint2 connects body B to body D

  var coordinateA, coordinateB; // float

  // TODO_ERIN there might be some problem with the joint edges in Joint.

  this.m_bodyC = this.m_joint1.getBodyA();
  this.m_bodyA = this.m_joint1.getBodyB();

  // Get geometry of joint1
  var xfA = this.m_bodyA.m_xf;
  var aA = this.m_bodyA.m_sweep.a;
  var xfC = this.m_bodyC.m_xf;
  var aC = this.m_bodyC.m_sweep.a;

  if (this.m_type1 === _RevoluteJoint2.default.TYPE) {
    var revolute = this.m_joint1; // RevoluteJoint
    this.m_localAnchorC = revolute.m_localAnchorA;
    this.m_localAnchorA = revolute.m_localAnchorB;
    this.m_referenceAngleA = revolute.m_referenceAngle;
    this.m_localAxisC = _Vec2.default.zero();

    coordinateA = aA - aC - this.m_referenceAngleA;
  } else {
    var prismatic = this.m_joint1; // PrismaticJoint
    this.m_localAnchorC = prismatic.m_localAnchorA;
    this.m_localAnchorA = prismatic.m_localAnchorB;
    this.m_referenceAngleA = prismatic.m_referenceAngle;
    this.m_localAxisC = prismatic.m_localXAxisA;

    var pC = this.m_localAnchorC;
    var pA = _Rot2.default.mulTVec2(xfC.q, _Vec2.default.add(_Rot2.default.mul(xfA.q, this.m_localAnchorA), _Vec2.default.sub(xfA.p, xfC.p)));
    coordinateA = _Vec2.default.dot(pA, this.m_localAxisC) - _Vec2.default.dot(pC, this.m_localAxisC);
  }

  this.m_bodyD = this.m_joint2.getBodyA();
  this.m_bodyB = this.m_joint2.getBodyB();

  // Get geometry of joint2
  var xfB = this.m_bodyB.m_xf;
  var aB = this.m_bodyB.m_sweep.a;
  var xfD = this.m_bodyD.m_xf;
  var aD = this.m_bodyD.m_sweep.a;

  if (this.m_type2 === _RevoluteJoint2.default.TYPE) {
    var revolute = this.m_joint2; // RevoluteJoint
    this.m_localAnchorD = revolute.m_localAnchorA;
    this.m_localAnchorB = revolute.m_localAnchorB;
    this.m_referenceAngleB = revolute.m_referenceAngle;
    this.m_localAxisD = _Vec2.default.zero();

    coordinateB = aB - aD - this.m_referenceAngleB;
  } else {
    var prismatic = this.m_joint2; // PrismaticJoint
    this.m_localAnchorD = prismatic.m_localAnchorA;
    this.m_localAnchorB = prismatic.m_localAnchorB;
    this.m_referenceAngleB = prismatic.m_referenceAngle;
    this.m_localAxisD = prismatic.m_localXAxisA;

    var pD = this.m_localAnchorD;
    var pB = _Rot2.default.mulTVec2(xfD.q, _Vec2.default.add(_Rot2.default.mul(xfB.q, this.m_localAnchorB), _Vec2.default.sub(xfB.p, xfD.p)));
    coordinateB = _Vec2.default.dot(pB, this.m_localAxisD) - _Vec2.default.dot(pD, this.m_localAxisD);
  }

  this.m_constant = coordinateA + this.m_ratio * coordinateB;

  this.m_impulse = 0.0;

  // Solver temp
  this.m_lcA, this.m_lcB, this.m_lcC, this.m_lcD; // Vec2
  this.m_mA, this.m_mB, this.m_mC, this.m_mD; // float
  this.m_iA, this.m_iB, this.m_iC, this.m_iD; // float
  this.m_JvAC, this.m_JvBD; // Vec2
  this.m_JwA, this.m_JwB, this.m_JwC, this.m_JwD; // float
  this.m_mass; // float

  // Gear Joint:
  // C0 = (coordinate1 + ratio * coordinate2)_initial
  // C = (coordinate1 + ratio * coordinate2) - C0 = 0
  // J = [J1 ratio * J2]
  // K = J * invM * JT
  // = J1 * invM1 * J1T + ratio * ratio * J2 * invM2 * J2T
  //
  // Revolute:
  // coordinate = rotation
  // Cdot = angularVelocity
  // J = [0 0 1]
  // K = J * invM * JT = invI
  //
  // Prismatic:
  // coordinate = dot(p - pg, ug)
  // Cdot = dot(v + cross(w, r), ug)
  // J = [ug cross(r, ug)]
  // K = J * invM * JT = invMass + invI * cross(r, ug)^2
}

/**
 * Get the first joint.
 */
GearJoint.prototype.getJoint1 = function () {
  return this.m_joint1;
};

/**
 * Get the second joint.
 */
GearJoint.prototype.getJoint2 = function () {
  return this.m_joint2;
};

/**
 * Set/Get the gear ratio.
 */
GearJoint.prototype.setRatio = function (ratio) {
  _ASSERT && common.assert(_Math2.default.isFinite(ratio));
  this.m_ratio = ratio;
};

GearJoint.prototype.getRatio = function () {
  return this.m_ratio;
};

GearJoint.prototype.getAnchorA = function () {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
};

GearJoint.prototype.getAnchorB = function () {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
};

GearJoint.prototype.getReactionForce = function (inv_dt) {
  return _Vec2.default.mul(this.m_impulse, this.m_JvAC).mul(inv_dt);
};

GearJoint.prototype.getReactionTorque = function (inv_dt) {
  var L = this.m_impulse * this.m_JwA; // float
  return inv_dt * L;
};

GearJoint.prototype.initVelocityConstraints = function (step) {
  this.m_lcA = this.m_bodyA.m_sweep.localCenter;
  this.m_lcB = this.m_bodyB.m_sweep.localCenter;
  this.m_lcC = this.m_bodyC.m_sweep.localCenter;
  this.m_lcD = this.m_bodyD.m_sweep.localCenter;
  this.m_mA = this.m_bodyA.m_invMass;
  this.m_mB = this.m_bodyB.m_invMass;
  this.m_mC = this.m_bodyC.m_invMass;
  this.m_mD = this.m_bodyD.m_invMass;
  this.m_iA = this.m_bodyA.m_invI;
  this.m_iB = this.m_bodyB.m_invI;
  this.m_iC = this.m_bodyC.m_invI;
  this.m_iD = this.m_bodyD.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var aC = this.m_bodyC.c_position.a;
  var vC = this.m_bodyC.c_velocity.v;
  var wC = this.m_bodyC.c_velocity.w;

  var aD = this.m_bodyD.c_position.a;
  var vD = this.m_bodyD.c_velocity.v;
  var wD = this.m_bodyD.c_velocity.w;

  var qA = _Rot2.default.neo(aA);
  var qB = _Rot2.default.neo(aB);
  var qC = _Rot2.default.neo(aC);
  var qD = _Rot2.default.neo(aD);

  this.m_mass = 0.0;

  if (this.m_type1 == _RevoluteJoint2.default.TYPE) {
    this.m_JvAC = _Vec2.default.zero();
    this.m_JwA = 1.0;
    this.m_JwC = 1.0;
    this.m_mass += this.m_iA + this.m_iC;
  } else {
    var u = _Rot2.default.mulVec2(qC, this.m_localAxisC); // Vec2
    var rC = _Rot2.default.mulSub(qC, this.m_localAnchorC, this.m_lcC); // Vec2
    var rA = _Rot2.default.mulSub(qA, this.m_localAnchorA, this.m_lcA); // Vec2
    this.m_JvAC = u;
    this.m_JwC = _Vec2.default.cross(rC, u);
    this.m_JwA = _Vec2.default.cross(rA, u);
    this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
  }

  if (this.m_type2 == _RevoluteJoint2.default.TYPE) {
    this.m_JvBD = _Vec2.default.zero();
    this.m_JwB = this.m_ratio;
    this.m_JwD = this.m_ratio;
    this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
  } else {
    var u = _Rot2.default.mulVec2(qD, this.m_localAxisD); // Vec2
    var rD = _Rot2.default.mulSub(qD, this.m_localAnchorD, this.m_lcD); // Vec2
    var rB = _Rot2.default.mulSub(qB, this.m_localAnchorB, this.m_lcB); // Vec2
    this.m_JvBD = _Vec2.default.mul(this.m_ratio, u);
    this.m_JwD = this.m_ratio * _Vec2.default.cross(rD, u);
    this.m_JwB = this.m_ratio * _Vec2.default.cross(rB, u);
    this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
  }

  // Compute effective mass.
  this.m_mass = this.m_mass > 0.0 ? 1.0 / this.m_mass : 0.0;

  if (step.warmStarting) {
    vA.addMul(this.m_mA * this.m_impulse, this.m_JvAC);
    wA += this.m_iA * this.m_impulse * this.m_JwA;

    vB.addMul(this.m_mB * this.m_impulse, this.m_JvBD);
    wB += this.m_iB * this.m_impulse * this.m_JwB;

    vC.subMul(this.m_mC * this.m_impulse, this.m_JvAC);
    wC -= this.m_iC * this.m_impulse * this.m_JwC;

    vD.subMul(this.m_mD * this.m_impulse, this.m_JvBD);
    wD -= this.m_iD * this.m_impulse * this.m_JwD;
  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
  this.m_bodyC.c_velocity.v.set(vC);
  this.m_bodyC.c_velocity.w = wC;
  this.m_bodyD.c_velocity.v.set(vD);
  this.m_bodyD.c_velocity.w = wD;
};

GearJoint.prototype.solveVelocityConstraints = function (step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;
  var vC = this.m_bodyC.c_velocity.v;
  var wC = this.m_bodyC.c_velocity.w;
  var vD = this.m_bodyD.c_velocity.v;
  var wD = this.m_bodyD.c_velocity.w;

  var Cdot = _Vec2.default.dot(this.m_JvAC, vA) - _Vec2.default.dot(this.m_JvAC, vC) + _Vec2.default.dot(this.m_JvBD, vB) - _Vec2.default.dot(this.m_JvBD, vD); // float
  Cdot += this.m_JwA * wA - this.m_JwC * wC + (this.m_JwB * wB - this.m_JwD * wD);

  var impulse = -this.m_mass * Cdot; // float
  this.m_impulse += impulse;

  vA.addMul(this.m_mA * impulse, this.m_JvAC);
  wA += this.m_iA * impulse * this.m_JwA;
  vB.addMul(this.m_mB * impulse, this.m_JvBD);
  wB += this.m_iB * impulse * this.m_JwB;
  vC.subMul(this.m_mC * impulse, this.m_JvAC);
  wC -= this.m_iC * impulse * this.m_JwC;
  vD.subMul(this.m_mD * impulse, this.m_JvBD);
  wD -= this.m_iD * impulse * this.m_JwD;

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
  this.m_bodyC.c_velocity.v.set(vC);
  this.m_bodyC.c_velocity.w = wC;
  this.m_bodyD.c_velocity.v.set(vD);
  this.m_bodyD.c_velocity.w = wD;
};

GearJoint.prototype.solvePositionConstraints = function (step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var cC = this.m_bodyC.c_position.c;
  var aC = this.m_bodyC.c_position.a;
  var cD = this.m_bodyD.c_position.c;
  var aD = this.m_bodyD.c_position.a;

  var qA = _Rot2.default.neo(aA);
  var qB = _Rot2.default.neo(aB);
  var qC = _Rot2.default.neo(aC);
  var qD = _Rot2.default.neo(aD);

  var linearError = 0.0; // float

  var coordinateA, coordinateB; // float

  var JvAC, JvBD; // Vec2
  var JwA, JwB, JwC, JwD; // float
  var mass = 0.0; // float

  if (this.m_type1 == _RevoluteJoint2.default.TYPE) {
    JvAC = _Vec2.default.zero();
    JwA = 1.0;
    JwC = 1.0;
    mass += this.m_iA + this.m_iC;

    coordinateA = aA - aC - this.m_referenceAngleA;
  } else {
    var u = _Rot2.default.mulVec2(qC, this.m_localAxisC); // Vec2
    var rC = _Rot2.default.mulSub(qC, this.m_localAnchorC, this.m_lcC); // Vec2
    var rA = _Rot2.default.mulSub(qA, this.m_localAnchorA, this.m_lcA); // Vec2
    JvAC = u;
    JwC = _Vec2.default.cross(rC, u);
    JwA = _Vec2.default.cross(rA, u);
    mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;

    var pC = _Vec2.default.sub(this.m_localAnchorC, this.m_lcC); // Vec2
    var pA = _Rot2.default.mulTVec2(qC, _Vec2.default.add(rA, _Vec2.default.sub(cA, cC))); // Vec2
    coordinateA = _Vec2.default.dot(_Vec2.default.sub(pA, pC), this.m_localAxisC);
  }

  if (this.m_type2 == _RevoluteJoint2.default.TYPE) {
    JvBD = _Vec2.default.zero();
    JwB = this.m_ratio;
    JwD = this.m_ratio;
    mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);

    coordinateB = aB - aD - this.m_referenceAngleB;
  } else {
    var u = _Rot2.default.mulVec2(qD, this.m_localAxisD);
    var rD = _Rot2.default.mulSub(qD, this.m_localAnchorD, this.m_lcD);
    var rB = _Rot2.default.mulSub(qB, this.m_localAnchorB, this.m_lcB);
    JvBD = _Vec2.default.mul(this.m_ratio, u);
    JwD = this.m_ratio * _Vec2.default.cross(rD, u);
    JwB = this.m_ratio * _Vec2.default.cross(rB, u);
    mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;

    var pD = _Vec2.default.sub(this.m_localAnchorD, this.m_lcD); // Vec2
    var pB = _Rot2.default.mulTVec2(qD, _Vec2.default.add(rB, _Vec2.default.sub(cB, cD))); // Vec2
    coordinateB = _Vec2.default.dot(pB, this.m_localAxisD) - _Vec2.default.dot(pD, this.m_localAxisD);
  }

  var C = coordinateA + this.m_ratio * coordinateB - this.m_constant; // float

  var impulse = 0.0; // float
  if (mass > 0.0) {
    impulse = -C / mass;
  }

  cA.addMul(this.m_mA * impulse, JvAC);
  aA += this.m_iA * impulse * JwA;
  cB.addMul(this.m_mB * impulse, JvBD);
  aB += this.m_iB * impulse * JwB;
  cC.subMul(this.m_mC * impulse, JvAC);
  aC -= this.m_iC * impulse * JwC;
  cD.subMul(this.m_mD * impulse, JvBD);
  aD -= this.m_iD * impulse * JwD;

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;
  this.m_bodyC.c_position.c.set(cC);
  this.m_bodyC.c_position.a = aC;
  this.m_bodyD.c_position.c.set(cD);
  this.m_bodyD.c_position.a = aD;

  // TODO_ERIN not implemented
  return linearError < _Settings2.default.linearSlop;
};
module.exports = exports.default;
