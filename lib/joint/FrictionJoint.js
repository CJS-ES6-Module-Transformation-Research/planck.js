Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FrictionJoint;

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

FrictionJoint.TYPE = 'friction-joint';

FrictionJoint._super = _Joint2.default;
FrictionJoint.prototype = (0, _create2.default)(FrictionJoint._super.prototype);

/**
 * @typedef {Object} FrictionJointDef
 *
 * Friction joint definition.
 * 
 * @prop {float} maxForce The maximum friction force in N.
 * @prop {float} maxTorque The maximum friction torque in N-m.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 */

var DEFAULTS = {
  maxForce: 0.0,
  maxTorque: 0.0
};

/**
 * Friction joint. This is used for top-down friction. It provides 2D
 * translational friction and angular friction.
 *
 * @param {FrictionJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec2} anchor Anchor in global coordination.
 */
function FrictionJoint(def, bodyA, bodyB, anchor) {
  if (!(this instanceof FrictionJoint)) {
    return new FrictionJoint(def, bodyA, bodyB, anchor);
  }

  def = (0, _options2.default)(def, DEFAULTS);
  _Joint2.default.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = FrictionJoint.TYPE;

  this.m_localAnchorA = anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || _Vec2.default.zero();
  this.m_localAnchorB = anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || _Vec2.default.zero();

  // Solver shared
  this.m_linearImpulse = _Vec2.default.zero();
  this.m_angularImpulse = 0.0;
  this.m_maxForce = def.maxForce;
  this.m_maxTorque = def.maxTorque;

  // Solver temp
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_linearMass; // Mat22
  this.m_angularMass; // float

  // Point-to-point constraint
  // Cdot = v2 - v1
  // = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)

  // Angle constraint
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
}

/**
 * The local anchor point relative to bodyA's origin.
 */
FrictionJoint.prototype.getLocalAnchorA = function () {
  return this.m_localAnchorA;
};

/**
 * The local anchor point relative to bodyB's origin.
 */
FrictionJoint.prototype.getLocalAnchorB = function () {
  return this.m_localAnchorB;
};

/**
 * Set the maximum friction force in N.
 */
FrictionJoint.prototype.setMaxForce = function (force) {
  _ASSERT && common.assert(_Math2.default.isFinite(force) && force >= 0.0);
  this.m_maxForce = force;
};

/**
 * Get the maximum friction force in N.
 */
FrictionJoint.prototype.getMaxForce = function () {
  return this.m_maxForce;
};

/**
 * Set the maximum friction torque in N*m.
 */
FrictionJoint.prototype.setMaxTorque = function (torque) {
  _ASSERT && common.assert(_Math2.default.isFinite(torque) && torque >= 0.0);
  this.m_maxTorque = torque;
};

/**
 * Get the maximum friction torque in N*m.
 */
FrictionJoint.prototype.getMaxTorque = function () {
  return this.m_maxTorque;
};

FrictionJoint.prototype.getAnchorA = function () {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
};

FrictionJoint.prototype.getAnchorB = function () {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
};

FrictionJoint.prototype.getReactionForce = function (inv_dt) {
  return _Vec2.default.mul(inv_dt, this.m_linearImpulse);
};

FrictionJoint.prototype.getReactionTorque = function (inv_dt) {
  return inv_dt * this.m_angularImpulse;
};

FrictionJoint.prototype.initVelocityConstraints = function (step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = _Rot2.default.neo(aA),
      qB = _Rot2.default.neo(aB);

  // Compute the effective mass matrix.
  this.m_rA = _Rot2.default.mulVec2(qA, _Vec2.default.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = _Rot2.default.mulVec2(qB, _Vec2.default.sub(this.m_localAnchorB, this.m_localCenterB));

  // J = [-I -r1_skew I r2_skew]
  // [ 0 -1 0 1]
  // r_skew = [-ry; rx]

  // Matlab
  // K = [ mA+r1y^2*iA+mB+r2y^2*iB, -r1y*iA*r1x-r2y*iB*r2x, -r1y*iA-r2y*iB]
  // [ -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB, r1x*iA+r2x*iB]
  // [ -r1y*iA-r2y*iB, r1x*iA+r2x*iB, iA+iB]

  var mA = this.m_invMassA,
      mB = this.m_invMassB; // float
  var iA = this.m_invIA,
      iB = this.m_invIB; // float

  var K = new _Mat2.default();
  K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y * this.m_rB.y;
  K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
  K.ey.x = K.ex.y;
  K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x * this.m_rB.x;

  this.m_linearMass = K.getInverse();

  this.m_angularMass = iA + iB;
  if (this.m_angularMass > 0.0) {
    this.m_angularMass = 1.0 / this.m_angularMass;
  }

  if (step.warmStarting) {
    // Scale impulses to support a variable time step.
    this.m_linearImpulse.mul(step.dtRatio);
    this.m_angularImpulse *= step.dtRatio;

    var P = _Vec2.default.neo(this.m_linearImpulse.x, this.m_linearImpulse.y);

    vA.subMul(mA, P);
    wA -= iA * (_Vec2.default.cross(this.m_rA, P) + this.m_angularImpulse);

    vB.addMul(mB, P);
    wB += iB * (_Vec2.default.cross(this.m_rB, P) + this.m_angularImpulse);
  } else {
    this.m_linearImpulse.setZero();
    this.m_angularImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
};

FrictionJoint.prototype.solveVelocityConstraints = function (step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA,
      mB = this.m_invMassB; // float
  var iA = this.m_invIA,
      iB = this.m_invIB; // float

  var h = step.dt; // float

  // Solve angular friction
  {
    var Cdot = wB - wA; // float
    var impulse = -this.m_angularMass * Cdot; // float

    var oldImpulse = this.m_angularImpulse; // float
    var maxImpulse = h * this.m_maxTorque; // float
    this.m_angularImpulse = _Math2.default.clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
    impulse = this.m_angularImpulse - oldImpulse;

    wA -= iA * impulse;
    wB += iB * impulse;
  }

  // Solve linear friction
  {
    var Cdot = _Vec2.default.sub(_Vec2.default.add(vB, _Vec2.default.cross(wB, this.m_rB)), _Vec2.default.add(vA, _Vec2.default.cross(wA, this.m_rA))); // Vec2

    var impulse = _Vec2.default.neg(_Mat2.default.mulVec2(this.m_linearMass, Cdot)); // Vec2
    var oldImpulse = this.m_linearImpulse; // Vec2
    this.m_linearImpulse.add(impulse);

    var maxImpulse = h * this.m_maxForce; // float

    if (this.m_linearImpulse.lengthSquared() > maxImpulse * maxImpulse) {
      this.m_linearImpulse.normalize();
      this.m_linearImpulse.mul(maxImpulse);
    }

    impulse = _Vec2.default.sub(this.m_linearImpulse, oldImpulse);

    vA.subMul(mA, impulse);
    wA -= iA * _Vec2.default.cross(this.m_rA, impulse);

    vB.addMul(mB, impulse);
    wB += iB * _Vec2.default.cross(this.m_rB, impulse);
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
};

FrictionJoint.prototype.solvePositionConstraints = function (step) {
  return true;
};
module.exports = exports.default;
