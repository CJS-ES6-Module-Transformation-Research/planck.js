import { expect as testutilexpect_expectjs } from "./testutil/expect";
import ext_sinon_sinon from "sinon";
import { Vec2 as libcommonVec2_Vec2js } from "../lib/common/Vec2";
import { Transform as libcommonTransform_Transformjs } from "../lib/common/Transform";
import { Sweep as libcommonSweep_Sweepjs } from "../lib/common/Sweep";
import { CircleShape as libshapeCircleShape_CircleShapejs } from "../lib/shape/CircleShape";

import {
  TimeOfImpact as libcollisionTimeOfImpact_TimeOfImpactjs,
  Input as TimeOfImpactjs_Input,
  Output as TimeOfImpactjs_Output,
} from "../lib/collision/TimeOfImpact";

import {
  Distance as libcollisionDistance_Distancejs,
  Input as Distancejs_Input,
  Output as Distancejs_Output,
  Proxy as Distancejs_Proxy,
  Cache as Distancejs_Cache,
} from "../lib/collision/Distance";

var TOIInput = TimeOfImpactjs_Input;
var TOIOutput = TimeOfImpactjs_Output;

var DistanceInput = Distancejs_Input;
var DistanceOutput = Distancejs_Output;
var DistanceProxy = Distancejs_Proxy;
var SimplexCache = Distancejs_Cache;

describe('CCD', function() {

  it('Distance', function() {
    var c1 = libshapeCircleShape_CircleShapejs(1);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new libcommonTransform_Transformjs(libcommonVec2_Vec2js(0, 0), 0);
    input.transformB = new libcommonTransform_Transformjs(libcommonVec2_Vec2js(1.9, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    libcollisionDistance_Distancejs(output, cache, input);

    testutilexpect_expectjs(output.distance).be(0);
    console.log(output);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new libcommonTransform_Transformjs(libcommonVec2_Vec2js(0, 0), 0);
    input.transformB = new libcommonTransform_Transformjs(libcommonVec2_Vec2js(2.1, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    libcollisionDistance_Distancejs(output, cache, input);

    testutilexpect_expectjs(output.distance).near(0.1)
    console.log(output);
  });

  it('TimeOfImpact', function() {
    var c1 = libshapeCircleShape_CircleShapejs(1);

    var input = new TOIInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);

    input.sweepA = new libcommonSweep_Sweepjs();
    input.sweepA = new libcommonSweep_Sweepjs();

    input.sweepA.setTransform(new libcommonTransform_Transformjs(libcommonVec2_Vec2js(0, 0), 0));
    input.sweepB.setTransform(new libcommonTransform_Transformjs(libcommonVec2_Vec2js(1.9, 0), 0));

    input.tMax = 1.0;

    var output = new TOIOutput();

    libcollisionTimeOfImpact_TimeOfImpactjs(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new libcommonTransform_Transformjs(libcommonVec2_Vec2js(2, 0), 0));

    libcollisionTimeOfImpact_TimeOfImpactjs(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new libcommonTransform_Transformjs(libcommonVec2_Vec2js(2.1, 0), 0));

    libcollisionTimeOfImpact_TimeOfImpactjs(output, input);
    console.log(output.t, output.state);
  });

  it('Solver', function() {
  });

});
