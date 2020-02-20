Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseJoint = undefined;

var _common = require("../util/common");

var _options = require("../util/options");

var _create = require("../util/create");

var _Math = require("../common/Math");

var _Vec = require("../common/Vec2");

var _Vec2 = require("../common/Vec3");

var _Mat = require("../common/Mat22");

var _Mat2 = require("../common/Mat33");

var _Rot = require("../common/Rot");

var _Sweep = require("../common/Sweep");

var _Transform = require("../common/Transform");

var _Joint = require("../Joint");

var MouseJoint_getMaxForce;
var MouseJoint_m_type;
var MouseJoint__super;
var MouseJoint_TYPE;
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

MouseJoint_TYPE = "mouse-joint";;

MouseJoint__super = _Joint.Joint;;
MouseJoint.prototype = (0, _create.createjs)(MouseJoint__super.prototype);

/**
 * @typedef {Object} MouseJointDef
 *
 * Mouse joint definition. This requires a world target point, tuning
 * parameters, and the time step.
 * 
 * @prop [maxForce = 0.0] The maximum constraint force that can be exerted to
 *       move the candidate body. Usually you will express as some multiple of
 *       the weight (multiplier * mass * gravity).
 * @prop [frequencyHz = 5.0] The response speed.
 * @prop [dampingRatio = 0.7] The damping ratio. 0 = no damping, 1 = critical
 *       damping.
 *
 * @prop {Vec2} target The initial world target point. This is assumed to
 *       coincide with the body anchor initially.
 */

var DEFAULTS = {
  maxForce: 0.0,
  frequencyHz: 5.0,
  dampingRatio: 0.7
};

function MouseJoint(def, bodyA, bodyB, target) {
  if (!(this instanceof MouseJoint)) {
    return new MouseJoint(def, bodyA, bodyB, target);
  }

  def = (0, _options.optionsjs)(def, DEFAULTS);
  _Joint.Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  MouseJoint_m_type = MouseJoint_TYPE;;

  _ASSERT && _common.assert.assert((0, _Math.isFinite)(def.maxForce) && def.maxForce >= 0.0);
  _ASSERT && _common.assert.assert((0, _Math.isFinite)(def.frequencyHz) && def.frequencyHz >= 0.0);
  _ASSERT && _common.assert.assert((0, _Math.isFinite)(def.dampingRatio) && def.dampingRatio >= 0.0);

  this.m_targetA = target ? (0, _Vec.clone)(target) : def.target || (0, _Vec.zero)();
  this.m_localAnchorB = (0, _Transform.mulTVec2)(bodyB.getTransform(), this.m_targetA);

  this.m_maxForce = def.maxForce;
  this.m_impulse = (0, _Vec.zero)();

  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;

  this.m_beta = 0.0;
  this.m_gamma = 0.0;

  // Solver temp
  this.m_rB = (0, _Vec.zero)();
  this.m_localCenterB = (0, _Vec.zero)();
  this.m_invMassB = 0.0;
  this.m_invIB = 0.0;
  this.mass = new Mat22();
  this.m_C = (0, _Vec.zero)();

  // p = attached point, m = mouse point
  // C = p - m
  // Cdot = v
  // = v + cross(w, r)
  // J = [I r_skew]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)
}

/**
 * Use this to update the target point.
 */
MouseJoint.prototype.setTarget = function (target) {
  if (this.m_bodyB.isAwake() == false) {
    this.m_bodyB.setAwake(true);
  }
  this.m_targetA = (0, _Vec.clone)(target);
};

MouseJoint.prototype.getTarget = function () {
  return this.m_targetA;
};

/**
 * Set/get the maximum force in Newtons.
 */
MouseJoint.prototype.setMaxForce = function (force) {
  this.m_maxForce = force;
};

MouseJoint_getMaxForce = function MouseJoint_getMaxForce() {
  return this.m_maxForce;
};;

/**
 * Set/get the frequency in Hertz.
 */
MouseJoint.prototype.setFrequency = function (hz) {
  this.m_frequencyHz = hz;
};

MouseJoint.prototype.getFrequency = function () {
  return this.m_frequencyHz;
};

/**
 * Set/get the damping ratio (dimensionless).
 */
MouseJoint.prototype.setDampingRatio = function (ratio) {
  this.m_dampingRatio = ratio;
};

MouseJoint.prototype.getDampingRatio = function () {
  return this.m_dampingRatio;
};

MouseJoint.prototype.getAnchorA = function () {
  return (0, _Vec.clone)(this.m_targetA);
};

MouseJoint.prototype.getAnchorB = function () {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
};

MouseJoint.prototype.getReactionForce = function (inv_dt) {
  return (0, _Vec.mul)(inv_dt, this.m_impulse);
};

MouseJoint.prototype.getReactionTorque = function (inv_dt) {
  return inv_dt * 0.0;
};

MouseJoint.prototype.shiftOrigin = function (newOrigin) {
  this.m_targetA.sub(newOrigin);
};

MouseJoint.prototype.initVelocityConstraints = function (step) {
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIB = this.m_bodyB.m_invI;

  var position = this.m_bodyB.c_position;
  var velocity = this.m_bodyB.c_velocity;

  var cB = position.c;
  var aB = position.a;
  var vB = velocity.v;
  var wB = velocity.w;

  var qB = (0, _Rot.neo)(aB);

  var mass = this.m_bodyB.getMass();

  // Frequency
  var omega = 2.0 * Math.PI * this.m_frequencyHz;

  // Damping coefficient
  var d = 2.0 * mass * this.m_dampingRatio * omega;

  // Spring stiffness
  var k = mass * (omega * omega);

  // magic formulas
  // gamma has units of inverse mass.
  // beta has units of inverse time.
  var h = step.dt;
  _ASSERT && _common.assert.assert(d + h * k > _Math.EPSILON);
  this.m_gamma = h * (d + h * k);
  if (this.m_gamma != 0.0) {
    this.m_gamma = 1.0 / this.m_gamma;
  }
  this.m_beta = h * k * this.m_gamma;

  // Compute the effective mass matrix.
  this.m_rB = (0, _Rot.mulVec2)(qB, (0, _Vec.sub)(this.m_localAnchorB, this.m_localCenterB));

  // K = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) *
  // invI2 * skew(r2)]
  // = [1/m1+1/m2 0 ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y
  // -r1.x*r1.y]
  // [ 0 1/m1+1/m2] [-r1.x*r1.y r1.x*r1.x] [-r1.x*r1.y r1.x*r1.x]
  var K = new Mat22();
  K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
  K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
  K.ey.x = K.ex.y;
  K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;

  this.m_mass = K.getInverse();

  this.m_C.set(cB);
  this.m_C.addCombine(1, this.m_rB, -1, this.m_targetA);
  this.m_C.mul(this.m_beta);

  // Cheat with some damping
  wB *= 0.98;

  if (step.warmStarting) {
    this.m_impulse.mul(step.dtRatio);
    vB.addMul(this.m_invMassB, this.m_impulse);
    wB += this.m_invIB * (0, _Vec.cross)(this.m_rB, this.m_impulse);
  } else {
    this.m_impulse.setZero();
  }

  velocity.v.set(vB);
  velocity.w = wB;
};

MouseJoint.prototype.solveVelocityConstraints = function (step) {
  var velocity = this.m_bodyB.c_velocity;
  var vB = (0, _Vec.clone)(velocity.v);
  var wB = velocity.w;

  // Cdot = v + cross(w, r)

  var Cdot = (0, _Vec.cross)(wB, this.m_rB);
  Cdot.add(vB);

  Cdot.addCombine(1, this.m_C, this.m_gamma, this.m_impulse);
  Cdot.neg();

  var impulse = Mat22.mulVec2(this.m_mass, Cdot);

  var oldImpulse = (0, _Vec.clone)(this.m_impulse);
  this.m_impulse.add(impulse);
  var maxImpulse = step.dt * this.m_maxForce;
  this.m_impulse.clamp(maxImpulse);
  impulse = (0, _Vec.sub)(this.m_impulse, oldImpulse);

  vB.addMul(this.m_invMassB, impulse);
  wB += this.m_invIB * (0, _Vec.cross)(this.m_rB, impulse);

  velocity.v.set(vB);
  velocity.w = wB;
};

MouseJoint.prototype.solvePositionConstraints = function (step) {
  return true;
};
var exported_MouseJoint = MouseJoint;

/**
 * A mouse joint is used to make a point on a body track a specified world
 * point. This a soft constraint with a maximum force. This allows the
 * constraint to stretch and without applying huge forces.
 * 
 * NOTE: this joint is not documented in the manual because it was developed to
 * be used in the testbed. If you want to learn how to use the mouse joint, look
 * at the testbed.
 *
 * @param {MouseJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
exports.MouseJoint = exported_MouseJoint;
