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

var Settings_maxManifoldPoints = 2;
var Settings_maxPolygonVertices = 12;
var Settings_aabbExtension = 0.1;
var Settings_aabbMultiplier = 2.0;
var Settings_linearSlop = 0.005;
var Settings_linearSlopSquared = Settings_linearSlop * Settings_linearSlop;
var Settings_angularSlop = 2.0 / 180.0 * Math.PI;
var Settings_polygonRadius = 2.0 * Settings_linearSlop;
var Settings_maxSubSteps = 8;
var Settings_maxTOIContacts = 32;
var Settings_maxTOIIterations = 20;
var Settings_maxDistnceIterations = 20;
var Settings_velocityThreshold = 1.0;
var Settings_maxLinearCorrection = 0.2;
var Settings_maxAngularCorrection = 8.0 / 180.0 * Math.PI;
var Settings_maxTranslation = 2.0;
var Settings_maxTranslationSquared = Settings_maxTranslation * Settings_maxTranslation;
var Settings_maxRotation = 0.5 * Math.PI;
var Settings_maxRotationSquared = Settings_maxRotation * Settings_maxRotation;
var Settings_baumgarte = 0.2;
var Settings_toiBaugarte = 0.75;
var Settings_timeToSleep = 0.5;
var Settings_linearSleepTolerance = 0.01;
var Settings_linearSleepToleranceSqr = Math.pow(Settings_linearSleepTolerance, 2);
var Settings_angularSleepTolerance = 2.0 / 180.0 * Math.PI;
var Settings_angularSleepToleranceSqr = Math.pow(Settings_angularSleepTolerance, 2);
export { Settings_maxManifoldPoints as maxManifoldPoints, Settings_maxPolygonVertices as maxPolygonVertices, Settings_aabbExtension as aabbExtension, Settings_aabbMultiplier as aabbMultiplier, Settings_linearSlop as linearSlop, Settings_linearSlopSquared as linearSlopSquared, Settings_angularSlop as angularSlop, Settings_polygonRadius as polygonRadius, Settings_maxSubSteps as maxSubSteps, Settings_maxTOIIterations as maxTOIIterations, Settings_maxDistnceIterations as maxDistnceIterations, Settings_velocityThreshold as velocityThreshold, Settings_maxLinearCorrection as maxLinearCorrection, Settings_maxAngularCorrection as maxAngularCorrection, Settings_maxTranslation as maxTranslation, Settings_maxTranslationSquared as maxTranslationSquared, Settings_maxRotation as maxRotation, Settings_maxRotationSquared as maxRotationSquared, Settings_baumgarte as baumgarte, Settings_toiBaugarte as toiBaugarte, Settings_timeToSleep as timeToSleep, Settings_linearSleepToleranceSqr as linearSleepToleranceSqr, Settings_angularSleepToleranceSqr as angularSleepToleranceSqr };

