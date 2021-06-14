var mod_TimeOfImpact = TimeOfImpact;

import {
  maxPolygonVertices as Settingsjs_maxPolygonVertices,
  linearSlop as Settingsjs_linearSlop,
  maxTOIIterations as Settingsjs_maxTOIIterations,
} from "../Settings";

import { assert as utilcommon_assert } from "../util/common";
import { now as utilTimer_now, diff as utilTimer_diff } from "../util/Timer";
import { math as Math } from "../common/Math";

import {
  zero as Vec2js_zero,
  dot as Vec2js_dot,
  cross as Vec2js_cross,
  sub as Vec2js_sub,
  neg as Vec2js_neg,
  mid as Vec2js_mid,
} from "../common/Vec2";

import { mulVec2 as Rotjs_mulVec2, mulTVec2 as Rotjs_mulTVec2 } from "../common/Rot";
import { Sweep as Sweep_Sweep } from "../common/Sweep";
import { identity as Transformjs_identity, mulVec2 as Transformjs_mulVec2 } from "../common/Transform";

import {
  Distance as Distance_Distance,
  Input as Distancejs_Input,
  Output as Distancejs_Output,
  Proxy as Distancejs_Proxy,
  Cache as Distancejs_Cache,
} from "./Distance";

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

mod_TimeOfImpact.Input = TOIInput;
mod_TimeOfImpact.Output = TOIOutput;

var stats = {};

var DistanceInput = Distancejs_Input;
var DistanceOutput = Distancejs_Output;
var DistanceProxy = Distancejs_Proxy;
var SimplexCache = Distancejs_Cache;

/**
 * Input parameters for TimeOfImpact.
 * 
 * @prop {DistanceProxy} proxyA
 * @prop {DistanceProxy} proxyB
 * @prop {Sweep} sweepA
 * @prop {Sweep} sweepB
 * @prop tMax defines sweep interval [0, tMax]
 */
function TOIInput() {
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.sweepA = new Sweep_Sweep();
  this.sweepB = new Sweep_Sweep();
  this.tMax;
}

// TOIOutput State
TOIOutput.e_unknown = 0;
TOIOutput.e_failed = 1;
TOIOutput.e_overlapped = 2;
TOIOutput.e_touching = 3;
TOIOutput.e_separated = 4;

/**
 * Output parameters for TimeOfImpact.
 * 
 * @prop state
 * @prop t
 */
function TOIOutput() {
  this.state;
  this.t;
}

stats.toiTime = 0;
stats.toiMaxTime = 0;
stats.toiCalls = 0;
stats.toiIters = 0;
stats.toiMaxIters = 0;
stats.toiRootIters = 0;
stats.toiMaxRootIters = 0;

/**
 * Compute the upper bound on time before two shapes penetrate. Time is
 * represented as a fraction between [0,tMax]. This uses a swept separating axis
 * and may miss some intermediate, non-tunneling collision. If you change the
 * time interval, you should call this function again.
 * 
 * Note: use Distance to compute the contact point and normal at the time of
 * impact.
 * 
 * CCD via the local separating axis method. This seeks progression by computing
 * the largest time at which separation is maintained.
 */
function TimeOfImpact(output, input) {
  var timer = utilTimer_now();

  ++stats.toiCalls;

  output.state = TOIOutput.e_unknown;
  output.t = input.tMax;

  var proxyA = input.proxyA; // DistanceProxy
  var proxyB = input.proxyB; // DistanceProxy

  var sweepA = input.sweepA; // Sweep
  var sweepB = input.sweepB; // Sweep

  // Large rotations can make the root finder fail, so we normalize the
  // sweep angles.
  sweepA.normalize();
  sweepB.normalize();

  var tMax = input.tMax;

  var totalRadius = proxyA.m_radius + proxyB.m_radius;
  var target = Math.max(Settingsjs_linearSlop, totalRadius - 3.0 * Settingsjs_linearSlop);
  var tolerance = 0.25 * Settingsjs_linearSlop;
  _ASSERT && utilcommon_assert(target > tolerance);

  var t1 = 0.0;
  var k_maxIterations = Settingsjs_maxTOIIterations;
  var iter = 0;

  // Prepare input for distance query.
  var cache = new SimplexCache();

  var distanceInput = new DistanceInput();
  distanceInput.proxyA = input.proxyA;
  distanceInput.proxyB = input.proxyB;
  distanceInput.useRadii = false;

  // The outer loop progressively attempts to compute new separating axes.
  // This loop terminates when an axis is repeated (no progress is made).
  for (;;) {
    var xfA = Transformjs_identity();
    var xfB = Transformjs_identity();
    sweepA.getTransform(xfA, t1);
    sweepB.getTransform(xfB, t1);

    // Get the distance between shapes. We can also use the results
    // to get a separating axis.
    distanceInput.transformA = xfA;
    distanceInput.transformB = xfB;
    var distanceOutput = new DistanceOutput();
    Distance_Distance(distanceOutput, cache, distanceInput);

    // If the shapes are overlapped, we give up on continuous collision.
    if (distanceOutput.distance <= 0.0) {
      // Failure!
      output.state = TOIOutput.e_overlapped;
      output.t = 0.0;
      break;
    }

    if (distanceOutput.distance < target + tolerance) {
      // Victory!
      output.state = TOIOutput.e_touching;
      output.t = t1;
      break;
    }

    // Initialize the separating axis.
    var fcn = new SeparationFunction();
    fcn.initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);

    if (false) {
      // Dump the curve seen by the root finder
      var N = 100;
      var dx = 1.0 / N;
      var xs = []; // [ N + 1 ];
      var fs = []; // [ N + 1 ];
      var x = 0.0;
      for (var i = 0; i <= N; ++i) {
        sweepA.getTransform(xfA, x);
        sweepB.getTransform(xfB, x);
        var f = fcn.evaluate(xfA, xfB) - target;
        printf("%g %g\n", x, f);
        xs[i] = x;
        fs[i] = f;
        x += dx;
      }
    }

    // Compute the TOI on the separating axis. We do this by successively
    // resolving the deepest point. This loop is bounded by the number of
    // vertices.
    var done = false;
    var t2 = tMax;
    var pushBackIter = 0;
    for (;;) {
      // Find the deepest point at t2. Store the witness point indices.
      var s2 = fcn.findMinSeparation(t2);
      var indexA = fcn.indexA;
      var indexB = fcn.indexB;

      // Is the final configuration separated?
      if (s2 > target + tolerance) {
        // Victory!
        output.state = TOIOutput.e_separated;
        output.t = tMax;
        done = true;
        break;
      }

      // Has the separation reached tolerance?
      if (s2 > target - tolerance) {
        // Advance the sweeps
        t1 = t2;
        break;
      }

      // Compute the initial separation of the witness points.
      var s1 = fcn.evaluate(t1);
      var indexA = fcn.indexA;
      var indexB = fcn.indexB;

      // Check for initial overlap. This might happen if the root finder
      // runs out of iterations.
      if (s1 < target - tolerance) {
        output.state = TOIOutput.e_failed;
        output.t = t1;
        done = true;
        break;
      }

      // Check for touching
      if (s1 <= target + tolerance) {
        // Victory! t1 should hold the TOI (could be 0.0).
        output.state = TOIOutput.e_touching;
        output.t = t1;
        done = true;
        break;
      }

      // Compute 1D root of: f(x) - target = 0
      var rootIterCount = 0;
      var a1 = t1, a2 = t2;
      for (;;) {
        // Use a mix of the secant rule and bisection.
        var t;
        if (rootIterCount & 1) {
          // Secant rule to improve convergence.
          t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
        } else {
          // Bisection to guarantee progress.
          t = 0.5 * (a1 + a2);
        }

        ++rootIterCount;
        ++stats.toiRootIters;

        var s = fcn.evaluate(t);
        var indexA = fcn.indexA;
        var indexB = fcn.indexB;

        if (Math.abs(s - target) < tolerance) {
          // t2 holds a tentative value for t1
          t2 = t;
          break;
        }

        // Ensure we continue to bracket the root.
        if (s > target) {
          a1 = t;
          s1 = s;
        } else {
          a2 = t;
          s2 = s;
        }

        if (rootIterCount == 50) {
          break;
        }
      }

      stats.toiMaxRootIters = Math.max(stats.toiMaxRootIters, rootIterCount);

      ++pushBackIter;

      if (pushBackIter == Settingsjs_maxPolygonVertices) {
        break;
      }
    }

    ++iter;
    ++stats.toiIters;

    if (done) {
      break;
    }

    if (iter == k_maxIterations) {
      // Root finder got stuck. Semi-victory.
      output.state = TOIOutput.e_failed;
      output.t = t1;
      break;
    }
  }

  stats.toiMaxIters = Math.max(stats.toiMaxIters, iter);

  var time = utilTimer_diff(timer);
  stats.toiMaxTime = Math.max(stats.toiMaxTime, time);
  stats.toiTime += time;
}

// SeparationFunction Type
var e_points = 1;
var e_faceA = 2;
var e_faceB = 3;

function SeparationFunction() {
  this.m_proxyA = new DistanceProxy();
  this.m_proxyB = new DistanceProxy();
  this.m_sweepA;// Sweep
  this.m_sweepB;// Sweep
  this.m_type;
  this.m_localPoint = Vec2js_zero();
  this.m_axis = Vec2js_zero();
}

// TODO_ERIN might not need to return the separation

/**
 * @param {SimplexCache} cache
 * @param {DistanceProxy} proxyA
 * @param {Sweep} sweepA
 * @param {DistanceProxy} proxyB
 * @param {Sweep} sweepB
 * @param {float} t1
 */
SeparationFunction.prototype.initialize = function(cache, proxyA, sweepA, proxyB, sweepB, t1) {
  this.m_proxyA = proxyA;
  this.m_proxyB = proxyB;
  var count = cache.count;
  _ASSERT && utilcommon_assert(0 < count && count < 3);

  this.m_sweepA = sweepA;
  this.m_sweepB = sweepB;

  var xfA = Transformjs_identity();
  var xfB = Transformjs_identity();
  this.m_sweepA.getTransform(xfA, t1);
  this.m_sweepB.getTransform(xfB, t1);

  if (count == 1) {
    this.m_type = e_points;
    var localPointA = this.m_proxyA.getVertex(cache.indexA[0]);
    var localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
    var pointA = Transformjs_mulVec2(xfA, localPointA);
    var pointB = Transformjs_mulVec2(xfB, localPointB);
    this.m_axis.setCombine(1, pointB, -1, pointA);
    var s = this.m_axis.normalize();
    return s;

  } else if (cache.indexA[0] == cache.indexA[1]) {
    // Two points on B and one on A.
    this.m_type = e_faceB;
    var localPointB1 = proxyB.getVertex(cache.indexB[0]);
    var localPointB2 = proxyB.getVertex(cache.indexB[1]);

    this.m_axis = Vec2js_cross(Vec2js_sub(localPointB2, localPointB1), 1.0);
    this.m_axis.normalize();
    var normal = Rotjs_mulVec2(xfB.q, this.m_axis);

    this.m_localPoint = Vec2js_mid(localPointB1, localPointB2);
    var pointB = Transformjs_mulVec2(xfB, this.m_localPoint);

    var localPointA = proxyA.getVertex(cache.indexA[0]);
    var pointA = Transformjs_mulVec2(xfA, localPointA);

    var s = Vec2js_dot(pointA, normal) - Vec2js_dot(pointB, normal);
    if (s < 0.0) {
      this.m_axis = Vec2js_neg(this.m_axis);
      s = -s;
    }
    return s;

  } else {
    // Two points on A and one or two points on B.
    this.m_type = e_faceA;
    var localPointA1 = this.m_proxyA.getVertex(cache.indexA[0]);
    var localPointA2 = this.m_proxyA.getVertex(cache.indexA[1]);

    this.m_axis = Vec2js_cross(Vec2js_sub(localPointA2, localPointA1), 1.0);
    this.m_axis.normalize();
    var normal = Rotjs_mulVec2(xfA.q, this.m_axis);

    this.m_localPoint = Vec2js_mid(localPointA1, localPointA2);
    var pointA = Transformjs_mulVec2(xfA, this.m_localPoint);

    var localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
    var pointB = Transformjs_mulVec2(xfB, localPointB);

    var s = Vec2js_dot(pointB, normal) - Vec2js_dot(pointA, normal);
    if (s < 0.0) {
      this.m_axis = Vec2js_neg(this.m_axis);
      s = -s;
    }
    return s;
  }
};

SeparationFunction.prototype.compute = function(find, t) {
  // It was findMinSeparation and evaluate
  var xfA = Transformjs_identity();
  var xfB = Transformjs_identity();
  this.m_sweepA.getTransform(xfA, t);
  this.m_sweepB.getTransform(xfB, t);

  switch (this.m_type) {
  case e_points: {
    if (find) {
      var axisA = Rotjs_mulTVec2(xfA.q, this.m_axis);
      var axisB = Rotjs_mulTVec2(xfB.q, Vec2js_neg(this.m_axis));

      this.indexA = this.m_proxyA.getSupport(axisA);
      this.indexB = this.m_proxyB.getSupport(axisB);
    }

    var localPointA = this.m_proxyA.getVertex(this.indexA);
    var localPointB = this.m_proxyB.getVertex(this.indexB);

    var pointA = Transformjs_mulVec2(xfA, localPointA);
    var pointB = Transformjs_mulVec2(xfB, localPointB);

    var sep = Vec2js_dot(pointB, this.m_axis) - Vec2js_dot(pointA, this.m_axis);
    return sep;
  }

  case e_faceA: {
    var normal = Rotjs_mulVec2(xfA.q, this.m_axis);
    var pointA = Transformjs_mulVec2(xfA, this.m_localPoint);

    if (find) {
      var axisB = Rotjs_mulTVec2(xfB.q, Vec2js_neg(normal));

      this.indexA = -1;
      this.indexB = this.m_proxyB.getSupport(axisB);
    }

    var localPointB = this.m_proxyB.getVertex(this.indexB);
    var pointB = Transformjs_mulVec2(xfB, localPointB);

    var sep = Vec2js_dot(pointB, normal) - Vec2js_dot(pointA, normal);
    return sep;
  }

  case e_faceB: {
    var normal = Rotjs_mulVec2(xfB.q, this.m_axis);
    var pointB = Transformjs_mulVec2(xfB, this.m_localPoint);

    if (find) {
      var axisA = Rotjs_mulTVec2(xfA.q, Vec2js_neg(normal));

      this.indexB = -1;
      this.indexA = this.m_proxyA.getSupport(axisA);
    }

    var localPointA = this.m_proxyA.getVertex(this.indexA);
    var pointA = Transformjs_mulVec2(xfA, localPointA);

    var sep = Vec2js_dot(pointA, normal) - Vec2js_dot(pointB, normal);
    return sep;
  }

  default:
    _ASSERT && utilcommon_assert(false);
    if (find) {
      this.indexA = -1;
      this.indexB = -1;
    }
    return 0.0;
  }
};

SeparationFunction.prototype.findMinSeparation = function(t) {
  return this.compute(true, t);
};

SeparationFunction.prototype.evaluate = function(t) {
  return this.compute(false, t);
};

/**
 * Compute the upper bound on time before two shapes penetrate. Time is
 * represented as a fraction between [0,tMax]. This uses a swept separating axis
 * and may miss some intermediate, non-tunneling collision. If you change the
 * time interval, you should call this function again.
 * 
 * Note: use Distance to compute the contact point and normal at the time of
 * impact.
 * 
 * CCD via the local separating axis method. This seeks progression by computing
 * the largest time at which separation is maintained.
 */
export { mod_TimeOfImpact as TimeOfImpact };
