'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mod_Settings = {};
var angularSleepToleranceSqr;
var angularSleepTolerance;
var linearSleepToleranceSqr;
var linearSleepTolerance;
var timeToSleep;
var toiBaugarte;
var baumgarte;
var maxRotationSquared;
var maxRotation;
var maxTranslationSquared;
var maxTranslation;
var maxAngularCorrection;
var maxLinearCorrection;
var velocityThreshold;
var maxDistnceIterations;
var maxTOIIterations;
var maxTOIContacts;
var maxSubSteps;
var polygonRadius;
var angularSlop;
var linearSlopSquared;
var linearSlop;
var aabbMultiplier;
var aabbExtension;
var maxPolygonVertices;
var maxManifoldPoints;
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

// TODO merge with World options?

var Settings = mod_Settings;

/**
 * Tuning constants based on meters-kilograms-seconds (MKS) units.
 */

// Collision
/**
 * The maximum number of contact points between two convex shapes. Do not change
 * this value.
 */
exports.maxManifoldPoints = maxManifoldPoints = 2;

/**
 * The maximum number of vertices on a convex polygon. You cannot increase this
 * too much because BlockAllocator has a maximum object size.
 */
exports.maxPolygonVertices = maxPolygonVertices = 12;

/**
 * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
 * by a small amount without triggering a tree adjustment. This is in meters.
 */
exports.aabbExtension = aabbExtension = 0.1;

/**
 * This is used to fatten AABBs in the dynamic tree. This is used to predict the
 * future position based on the current displacement. This is a dimensionless
 * multiplier.
 */
exports.aabbMultiplier = aabbMultiplier = 2.0;

/**
 * A small length used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
exports.linearSlop = linearSlop = 0.005;
exports.linearSlopSquared = linearSlopSquared = linearSlop * linearSlop;

/**
 * A small angle used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
exports.angularSlop = angularSlop = 2.0 / 180.0 * Math.PI;

/**
 * The radius of the polygon/edge shape skin. This should not be modified.
 * Making this smaller means polygons will have an insufficient buffer for
 * continuous collision. Making it larger may create artifacts for vertex
 * collision.
 */
exports.polygonRadius = polygonRadius = 2.0 * linearSlop;

/**
 * Maximum number of sub-steps per contact in continuous physics simulation.
 */
exports.maxSubSteps = maxSubSteps = 8;

// Dynamics

/**
 * Maximum number of contacts to be handled to solve a TOI impact.
 */
maxTOIContacts = 32;

/**
 * Maximum iterations to solve a TOI.
 */
exports.maxTOIIterations = maxTOIIterations = 20;

/**
 * Maximum iterations to find Distance.
 */
exports.maxDistnceIterations = maxDistnceIterations = 20;

/**
 * A velocity threshold for elastic collisions. Any collision with a relative
 * linear velocity below this threshold will be treated as inelastic.
 */
exports.velocityThreshold = velocityThreshold = 1.0;

/**
 * The maximum linear position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
exports.maxLinearCorrection = maxLinearCorrection = 0.2;

/**
 * The maximum angular position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
exports.maxAngularCorrection = maxAngularCorrection = 8.0 / 180.0 * Math.PI;

/**
 * The maximum linear velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
exports.maxTranslation = maxTranslation = 2.0;
exports.maxTranslationSquared = maxTranslationSquared = maxTranslation * maxTranslation;

/**
 * The maximum angular velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
exports.maxRotation = maxRotation = 0.5 * Math.PI;
exports.maxRotationSquared = maxRotationSquared = maxRotation * maxRotation;

/**
 * This scale factor controls how fast overlap is resolved. Ideally this would
 * be 1 so that overlap is removed in one time step. However using values close
 * to 1 often lead to overshoot.
 */
exports.baumgarte = baumgarte = 0.2;
exports.toiBaugarte = toiBaugarte = 0.75;

// Sleep

/**
 * The time that a body must be still before it will go to sleep.
 */
exports.timeToSleep = timeToSleep = 0.5;

/**
 * A body cannot sleep if its linear velocity is above this tolerance.
 */
linearSleepTolerance = 0.01;

exports.linearSleepToleranceSqr = linearSleepToleranceSqr = Math.pow(linearSleepTolerance, 2);

/**
 * A body cannot sleep if its angular velocity is above this tolerance.
 */
angularSleepTolerance = 2.0 / 180.0 * Math.PI;

exports.angularSleepToleranceSqr = angularSleepToleranceSqr = Math.pow(angularSleepTolerance, 2);

exports.maxManifoldPoints = maxManifoldPoints;
exports.maxPolygonVertices = maxPolygonVertices;
exports.aabbExtension = aabbExtension;
exports.aabbMultiplier = aabbMultiplier;
exports.linearSlop = linearSlop;
exports.linearSlopSquared = linearSlopSquared;
exports.angularSlop = angularSlop;
exports.polygonRadius = polygonRadius;
exports.maxSubSteps = maxSubSteps;
exports.maxTOIIterations = maxTOIIterations;
exports.maxDistnceIterations = maxDistnceIterations;
exports.velocityThreshold = velocityThreshold;
exports.maxLinearCorrection = maxLinearCorrection;
exports.maxAngularCorrection = maxAngularCorrection;
exports.maxTranslation = maxTranslation;
exports.maxTranslationSquared = maxTranslationSquared;
exports.maxRotation = maxRotation;
exports.maxRotationSquared = maxRotationSquared;
exports.baumgarte = baumgarte;
exports.toiBaugarte = toiBaugarte;
exports.timeToSleep = timeToSleep;
exports.linearSleepToleranceSqr = linearSleepToleranceSqr;
exports.angularSleepToleranceSqr = angularSleepToleranceSqr;