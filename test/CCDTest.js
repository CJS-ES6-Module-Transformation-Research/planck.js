import { expect as testutilexpect_expect } from "./testutil/expect";
import { Vec2 as libcommonVec2_Vec2 } from "../lib/common/Vec2";
import { Transform as libcommonTransform_Transform } from "../lib/common/Transform";
import { Sweep as libcommonSweep_Sweep } from "../lib/common/Sweep";
import { CircleShape as libshapeCircleShape_CircleShape } from "../lib/shape/CircleShape";
import { TimeOfImpact as libcollisionTimeOfImpact_TimeOfImpact } from "../lib/collision/TimeOfImpact";
import { Distance as libcollisionDistance_Distance } from "../lib/collision/Distance";
var sinon = require('sinon');

var TOIInput = libcollisionTimeOfImpact_TimeOfImpact.Input;
var TOIOutput = libcollisionTimeOfImpact_TimeOfImpact.Output;

var DistanceInput = libcollisionDistance_Distance.Input;
var DistanceOutput = libcollisionDistance_Distance.Output;
var DistanceProxy = libcollisionDistance_Distance.Proxy;
var SimplexCache = libcollisionDistance_Distance.Cache;

describe('CCD', function() {

  it('Distance', function() {
    var c1 = libshapeCircleShape_CircleShape(1);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new libcommonTransform_Transform(libcommonVec2_Vec2(0, 0), 0);
    input.transformB = new libcommonTransform_Transform(libcommonVec2_Vec2(1.9, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    libcollisionDistance_Distance(output, cache, input);

    testutilexpect_expect(output.distance).be(0);
    console.log(output);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new libcommonTransform_Transform(libcommonVec2_Vec2(0, 0), 0);
    input.transformB = new libcommonTransform_Transform(libcommonVec2_Vec2(2.1, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    libcollisionDistance_Distance(output, cache, input);

    testutilexpect_expect(output.distance).near(0.1)
    console.log(output);
  });

  it('TimeOfImpact', function() {
    var c1 = libshapeCircleShape_CircleShape(1);

    var input = new TOIInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);

    input.sweepA = new libcommonSweep_Sweep();
    input.sweepA = new libcommonSweep_Sweep();

    input.sweepA.setTransform(new libcommonTransform_Transform(libcommonVec2_Vec2(0, 0), 0));
    input.sweepB.setTransform(new libcommonTransform_Transform(libcommonVec2_Vec2(1.9, 0), 0));

    input.tMax = 1.0;

    var output = new TOIOutput();

    libcollisionTimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new libcommonTransform_Transform(libcommonVec2_Vec2(2, 0), 0));

    libcollisionTimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new libcommonTransform_Transform(libcommonVec2_Vec2(2.1, 0), 0));

    libcollisionTimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);
  });

  it('Solver', function() {
  });

});
