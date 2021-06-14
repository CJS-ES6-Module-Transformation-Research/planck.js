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
maxManifoldPoints = 2;

/**
 * The maximum number of vertices on a convex polygon. You cannot increase this
 * too much because BlockAllocator has a maximum object size.
 */
maxPolygonVertices = 12;

/**
 * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
 * by a small amount without triggering a tree adjustment. This is in meters.
 */
aabbExtension = 0.1;

/**
 * This is used to fatten AABBs in the dynamic tree. This is used to predict the
 * future position based on the current displacement. This is a dimensionless
 * multiplier.
 */
aabbMultiplier = 2.0;

/**
 * A small length used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
linearSlop = 0.005;
linearSlopSquared = linearSlop * linearSlop;

/**
 * A small angle used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
angularSlop = (2.0 / 180.0 * Math.PI);

/**
 * The radius of the polygon/edge shape skin. This should not be modified.
 * Making this smaller means polygons will have an insufficient buffer for
 * continuous collision. Making it larger may create artifacts for vertex
 * collision.
 */
polygonRadius = (2.0 * linearSlop);

/**
 * Maximum number of sub-steps per contact in continuous physics simulation.
 */
maxSubSteps = 8;

// Dynamics

/**
 * Maximum number of contacts to be handled to solve a TOI impact.
 */
maxTOIContacts = 32;

/**
 * Maximum iterations to solve a TOI.
 */
maxTOIIterations = 20;

/**
 * Maximum iterations to find Distance.
 */
maxDistnceIterations = 20;

/**
 * A velocity threshold for elastic collisions. Any collision with a relative
 * linear velocity below this threshold will be treated as inelastic.
 */
velocityThreshold = 1.0;

/**
 * The maximum linear position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
maxLinearCorrection = 0.2;

/**
 * The maximum angular position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
maxAngularCorrection = (8.0 / 180.0 * Math.PI);

/**
 * The maximum linear velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
maxTranslation = 2.0;
maxTranslationSquared = (maxTranslation * maxTranslation);

/**
 * The maximum angular velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
maxRotation = (0.5 * Math.PI)
maxRotationSquared = (maxRotation * maxRotation)

/**
 * This scale factor controls how fast overlap is resolved. Ideally this would
 * be 1 so that overlap is removed in one time step. However using values close
 * to 1 often lead to overshoot.
 */
baumgarte = 0.2;
toiBaugarte = 0.75;

// Sleep

/**
 * The time that a body must be still before it will go to sleep.
 */
timeToSleep = 0.5;

/**
 * A body cannot sleep if its linear velocity is above this tolerance.
 */
linearSleepTolerance = 0.01;

linearSleepToleranceSqr = Math.pow(linearSleepTolerance, 2);

/**
 * A body cannot sleep if its angular velocity is above this tolerance.
 */
angularSleepTolerance = (2.0 / 180.0 * Math.PI);

angularSleepToleranceSqr = Math.pow(angularSleepTolerance, 2);

export { maxManifoldPoints, maxPolygonVertices, aabbExtension, aabbMultiplier, linearSlop, linearSlopSquared, angularSlop, polygonRadius, maxSubSteps, maxTOIIterations, maxDistnceIterations, velocityThreshold, maxLinearCorrection, maxAngularCorrection, maxTranslation, maxTranslationSquared, maxRotation, maxRotationSquared, baumgarte, toiBaugarte, timeToSleep, linearSleepToleranceSqr, angularSleepToleranceSqr };

