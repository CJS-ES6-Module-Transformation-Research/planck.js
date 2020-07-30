var exportObject = {};
var Settings_angularSleepToleranceSqr;
var Settings_angularSleepTolerance;
var Settings_linearSleepToleranceSqr;
var Settings_linearSleepTolerance;
var Settings_timeToSleep;
var Settings_toiBaugarte;
var Settings_baumgarte;
var Settings_maxRotationSquared;
var Settings_maxRotation;
var Settings_maxTranslationSquared;
var Settings_maxTranslation;
var Settings_maxAngularCorrection;
var Settings_maxLinearCorrection;
var Settings_velocityThreshold;
var Settings_maxDistnceIterations;
var Settings_maxTOIIterations;
var Settings_maxTOIContacts;
var Settings_maxSubSteps;
var Settings_polygonRadius;
var Settings_angularSlop;
var Settings_linearSlopSquared;
var Settings_linearSlop;
var Settings_aabbMultiplier;
var Settings_aabbExtension;
var Settings_maxPolygonVertices;
var Settings_maxManifoldPoints;
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

var Settings = exportObject;

/**
 * Tuning constants based on meters-kilograms-seconds (MKS) units.
 */

// Collision
/**
 * The maximum number of contact points between two convex shapes. Do not change
 * this value.
 */
Settings_maxManifoldPoints = 2;

/**
 * The maximum number of vertices on a convex polygon. You cannot increase this
 * too much because BlockAllocator has a maximum object size.
 */
Settings_maxPolygonVertices = 12;

/**
 * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
 * by a small amount without triggering a tree adjustment. This is in meters.
 */
Settings_aabbExtension = 0.1;

/**
 * This is used to fatten AABBs in the dynamic tree. This is used to predict the
 * future position based on the current displacement. This is a dimensionless
 * multiplier.
 */
Settings_aabbMultiplier = 2.0;

/**
 * A small length used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
Settings_linearSlop = 0.005;
Settings_linearSlopSquared = Settings_linearSlop * Settings_linearSlop;

/**
 * A small angle used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
Settings_angularSlop = (2.0 / 180.0 * Math.PI);

/**
 * The radius of the polygon/edge shape skin. This should not be modified.
 * Making this smaller means polygons will have an insufficient buffer for
 * continuous collision. Making it larger may create artifacts for vertex
 * collision.
 */
Settings_polygonRadius = (2.0 * Settings_linearSlop);

/**
 * Maximum number of sub-steps per contact in continuous physics simulation.
 */
Settings_maxSubSteps = 8;

// Dynamics

/**
 * Maximum number of contacts to be handled to solve a TOI impact.
 */
Settings_maxTOIContacts = 32;

/**
 * Maximum iterations to solve a TOI.
 */
Settings_maxTOIIterations = 20;

/**
 * Maximum iterations to find Distance.
 */
Settings_maxDistnceIterations = 20;

/**
 * A velocity threshold for elastic collisions. Any collision with a relative
 * linear velocity below this threshold will be treated as inelastic.
 */
Settings_velocityThreshold = 1.0;

/**
 * The maximum linear position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
Settings_maxLinearCorrection = 0.2;

/**
 * The maximum angular position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
Settings_maxAngularCorrection = (8.0 / 180.0 * Math.PI);

/**
 * The maximum linear velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
Settings_maxTranslation = 2.0;
Settings_maxTranslationSquared = (Settings_maxTranslation * Settings_maxTranslation);

/**
 * The maximum angular velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
Settings_maxRotation = (0.5 * Math.PI)
Settings_maxRotationSquared = (Settings_maxRotation * Settings_maxRotation)

/**
 * This scale factor controls how fast overlap is resolved. Ideally this would
 * be 1 so that overlap is removed in one time step. However using values close
 * to 1 often lead to overshoot.
 */
Settings_baumgarte = 0.2;
Settings_toiBaugarte = 0.75;

// Sleep

/**
 * The time that a body must be still before it will go to sleep.
 */
Settings_timeToSleep = 0.5;

/**
 * A body cannot sleep if its linear velocity is above this tolerance.
 */
Settings_linearSleepTolerance = 0.01;

Settings_linearSleepToleranceSqr = Math.pow(Settings_linearSleepTolerance, 2);

/**
 * A body cannot sleep if its angular velocity is above this tolerance.
 */
Settings_angularSleepTolerance = (2.0 / 180.0 * Math.PI);

Settings_angularSleepToleranceSqr = Math.pow(Settings_angularSleepTolerance, 2);

export { Settings_maxManifoldPoints as maxManifoldPoints, Settings_maxPolygonVertices as maxPolygonVertices, Settings_aabbExtension as aabbExtension, Settings_aabbMultiplier as aabbMultiplier, Settings_linearSlop as linearSlop, Settings_linearSlopSquared as linearSlopSquared, Settings_angularSlop as angularSlop, Settings_polygonRadius as polygonRadius, Settings_maxSubSteps as maxSubSteps, Settings_maxTOIIterations as maxTOIIterations, Settings_maxDistnceIterations as maxDistnceIterations, Settings_velocityThreshold as velocityThreshold, Settings_maxLinearCorrection as maxLinearCorrection, Settings_maxAngularCorrection as maxAngularCorrection, Settings_maxTranslation as maxTranslation, Settings_maxTranslationSquared as maxTranslationSquared, Settings_maxRotation as maxRotation, Settings_maxRotationSquared as maxRotationSquared, Settings_baumgarte as baumgarte, Settings_toiBaugarte as toiBaugarte, Settings_timeToSleep as timeToSleep, Settings_linearSleepToleranceSqr as linearSleepToleranceSqr, Settings_angularSleepToleranceSqr as angularSleepToleranceSqr };

