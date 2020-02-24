import { optionsjs as DistanceJoint_optionsjs } from "../util/options";
import { createjs as DistanceJoint_createjs } from "../util/create";

import {
  linearSlop as Settingsjs_linearSlop,
  maxLinearCorrection as Settingsjs_maxLinearCorrection,
} from "../Settings";

import { isFinite as Mathjs_isFinite, clamp as Mathjs_clamp } from "../common/Math";

import {
  Vec2 as DistanceJoint_Vec2,
  zero as Vec2js_zero,
  distance as Vec2js_distance,
  dot as Vec2js_dot,
  cross as Vec2js_cross,
  add as Vec2js_add,
  sub as Vec2js_sub,
  mul as Vec2js_mul,
} from "../common/Vec2";

import { Vec3 as DistanceJoint_Vec3 } from "../common/Vec3";
import { Mat22 as DistanceJoint_Mat22 } from "../common/Mat22";
import { Mat33 as DistanceJoint_Mat33 } from "../common/Mat33";

import {
  Rot as DistanceJoint_Rot,
  neo as Rotjs_neo,
  mulVec2 as Rotjs_mulVec2,
  mulSub as Rotjs_mulSub,
} from "../common/Rot";

import { Sweep as DistanceJoint_Sweep } from "../common/Sweep";
import { Joint as DistanceJoint_Joint } from "../Joint";
var DistanceJoint_m_type;
var DistanceJoint__super;
var DistanceJoint_TYPE;
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

DistanceJoint_TYPE = "distance-joint";;

DistanceJoint__super = DistanceJoint_Joint;;
DistanceJoint.prototype = DistanceJoint_createjs(DistanceJoint__super.prototype);

/**
 * @typedef {Object} DistanceJointDef
 *
 * Distance joint definition. This requires defining an anchor point on both
 * bodies and the non-zero length of the distance joint. The definition uses
 * local anchor points so that the initial configuration can violate the
 * constraint slightly. This helps when saving and loading a game. Warning: Do
 * not use a zero or short length.
 * 
 * @prop {float} frequencyHz The mass-spring-damper frequency in Hertz. A value
 *       of 0 disables softness.
 * @prop {float} dampingRatio The damping ratio. 0 = no damping, 1 = critical
 *       damping.
 *
 * @prop {Vec2} def.localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} def.localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {number} def.length Distance length.
 */

var DEFAULTS = {
  frequencyHz : 0.0,
  dampingRatio : 0.0
};

function DistanceJoint(def, bodyA, bodyB, anchorA, anchorB) {
  if (!(this instanceof DistanceJoint)) {
    return new DistanceJoint(def, bodyA, bodyB, anchorA, anchorB);
  }

  // order of constructor arguments is changed in v0.2
  if (bodyB && anchorA && ('m_type' in anchorA) && ('x' in bodyB) && ('y' in bodyB)) {
    var temp = bodyB;
    bodyB = anchorA;
    anchorA = temp;
  }

  def = DistanceJoint_optionsjs(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  DistanceJoint_m_type = DistanceJoint_TYPE;;

  // Solver shared
  this.m_localAnchorA = anchorA ? bodyA.getLocalPoint(anchorA) : def.localAnchorA || Vec2js_zero();
  this.m_localAnchorB = anchorB ? bodyB.getLocalPoint(anchorB) : def.localAnchorB || Vec2js_zero();
  this.m_length = Mathjs_isFinite(def.length) ? def.length :
    Vec2js_distance(bodyA.getWorldPoint(this.m_localAnchorA), bodyB.getWorldPoint(this.m_localAnchorB));
  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;
  this.m_impulse = 0.0;
  this.m_gamma = 0.0;
  this.m_bias = 0.0;

  // Solver temp
  this.m_u; // Vec2
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA;
  this.m_invMassB;
  this.m_invIA;
  this.m_invIB;
  this.m_mass;

  // 1-D constrained system
  // m (v2 - v1) = lambda
  // v2 + (beta/h) * x1 + gamma * lambda = 0, gamma has units of inverse mass.
  // x2 = x1 + h * v2

  // 1-D mass-damper-spring system
  // m (v2 - v1) + h * d * v2 + h * k *

  // C = norm(p2 - p1) - L
  // u = (p2 - p1) / norm(p2 - p1)
  // Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
  // J = [-u -cross(r1, u) u cross(r2, u)]
  // K = J * invM * JT
  // = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2
}

/**
 * The local anchor point relative to bodyA's origin.
 */
DistanceJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
DistanceJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * Set/get the natural length. Manipulating the length can lead to non-physical
 * behavior when the frequency is zero.
 */
DistanceJoint.prototype.setLength = function(length) {
  this.m_length = length;
}

DistanceJoint.prototype.getLength = function() {
  return this.m_length;
}

DistanceJoint.prototype.setFrequency = function(hz) {
  this.m_frequencyHz = hz;
}

DistanceJoint.prototype.getFrequency = function() {
  return this.m_frequencyHz;
}

DistanceJoint.prototype.setDampingRatio = function(ratio) {
  this.m_dampingRatio = ratio;
}

DistanceJoint.prototype.getDampingRatio = function() {
  return this.m_dampingRatio;
}

DistanceJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

DistanceJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

DistanceJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2js_mul(this.m_impulse, this.m_u).mul(inv_dt);
}

DistanceJoint.prototype.getReactionTorque = function(inv_dt) {
  return 0.0;
}

DistanceJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rotjs_neo(aA);
  var qB = Rotjs_neo(aB);

  this.m_rA = Rotjs_mulVec2(qA, Vec2js_sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rotjs_mulVec2(qB, Vec2js_sub(this.m_localAnchorB, this.m_localCenterB));
  this.m_u = Vec2js_sub(Vec2js_add(cB, this.m_rB), Vec2js_add(cA, this.m_rA));

  // Handle singularity.
  var length = this.m_u.length();
  if (length > Settingsjs_linearSlop) {
    this.m_u.mul(1.0 / length);
  } else {
    this.m_u.set(0.0, 0.0);
  }

  var crAu = Vec2js_cross(this.m_rA, this.m_u);
  var crBu = Vec2js_cross(this.m_rB, this.m_u);
  var invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB
      + this.m_invIB * crBu * crBu;

  // Compute the effective mass matrix.
  this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;

  if (this.m_frequencyHz > 0.0) {
    var C = length - this.m_length;

    // Frequency
    var omega = 2.0 * Math.PI * this.m_frequencyHz;

    // Damping coefficient
    var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;

    // Spring stiffness
    var k = this.m_mass * omega * omega;

    // magic formulas
    var h = step.dt;
    this.m_gamma = h * (d + h * k);
    this.m_gamma = this.m_gamma != 0.0 ? 1.0 / this.m_gamma : 0.0;
    this.m_bias = C * h * k * this.m_gamma;

    invMass += this.m_gamma;
    this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
  } else {
    this.m_gamma = 0.0;
    this.m_bias = 0.0;
  }

  if (step.warmStarting) {
    // Scale the impulse to support a variable time step.
    this.m_impulse *= step.dtRatio;

    var P = Vec2js_mul(this.m_impulse, this.m_u);

    vA.subMul(this.m_invMassA, P);
    wA -= this.m_invIA * Vec2js_cross(this.m_rA, P);

    vB.addMul(this.m_invMassB, P);
    wB += this.m_invIB * Vec2js_cross(this.m_rB, P);

  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

DistanceJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  // Cdot = dot(u, v + cross(w, r))
  var vpA = Vec2js_add(vA, Vec2js_cross(wA, this.m_rA));
  var vpB = Vec2js_add(vB, Vec2js_cross(wB, this.m_rB));
  var Cdot = Vec2js_dot(this.m_u, vpB) - Vec2js_dot(this.m_u, vpA);

  var impulse = -this.m_mass
      * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
  this.m_impulse += impulse;

  var P = Vec2js_mul(impulse, this.m_u);
  vA.subMul(this.m_invMassA, P);
  wA -= this.m_invIA * Vec2js_cross(this.m_rA, P);
  vB.addMul(this.m_invMassB, P);
  wB += this.m_invIB * Vec2js_cross(this.m_rB, P);

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

DistanceJoint.prototype.solvePositionConstraints = function(step) {
  if (this.m_frequencyHz > 0.0) {
    // There is no position correction for soft distance constraints.
    return true;
  }

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rotjs_neo(aA);
  var qB = Rotjs_neo(aB);

  var rA = Rotjs_mulSub(qA, this.m_localAnchorA, this.m_localCenterA);
  var rB = Rotjs_mulSub(qB, this.m_localAnchorB, this.m_localCenterB);
  var u = Vec2js_sub(Vec2js_add(cB, rB), Vec2js_add(cA, rA));

  var length = u.normalize();
  var C = length - this.m_length;
  C = Mathjs_clamp(C, -Settingsjs_maxLinearCorrection, Settingsjs_maxLinearCorrection);

  var impulse = -this.m_mass * C;
  var P = Vec2js_mul(impulse, u);

  cA.subMul(this.m_invMassA, P);
  aA -= this.m_invIA * Vec2js_cross(rA, P);
  cB.addMul(this.m_invMassB, P);
  aB += this.m_invIB * Vec2js_cross(rB, P);

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;

  return Math.abs(C) < Settingsjs_linearSlop;
}
var exported_DistanceJoint = DistanceJoint;

/**
 * A distance joint constrains two points on two bodies to remain at a fixed
 * distance from each other. You can view this as a massless, rigid rod.
 *
 * @param {DistanceJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec2} anchorA Anchor A in global coordination.
 * @param {Vec2} anchorB Anchor B in global coordination.
 */
export { exported_DistanceJoint as DistanceJoint };
