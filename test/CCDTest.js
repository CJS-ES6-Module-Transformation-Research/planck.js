import { expect as expect_expect } from "./testutil/expect";
import sinon from "sinon";
import { Vec2 as Vec2_Vec2 } from "../lib/common/Vec2";
import { Transform as Transform_Transform } from "../lib/common/Transform";
import { Sweep as CCDTest_Sweep } from "../lib/common/Sweep";
import { CircleShape as CCDTest_Circle } from "../lib/shape/CircleShape";

import {
  TimeOfImpact as TimeOfImpact_TimeOfImpact,
  Input as TimeOfImpactjs_Input,
  Output as TimeOfImpactjs_Output,
} from "../lib/collision/TimeOfImpact";

import {
  Distance as Distance_Distance,
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
    var c1 = CCDTest_Circle(1);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new Transform_Transform(Vec2_Vec2(0, 0), 0);
    input.transformB = new Transform_Transform(Vec2_Vec2(1.9, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    Distance_Distance(output, cache, input);

    expect_expect(output.distance).be(0);
    console.log(output);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new Transform_Transform(Vec2_Vec2(0, 0), 0);
    input.transformB = new Transform_Transform(Vec2_Vec2(2.1, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    Distance_Distance(output, cache, input);

    expect_expect(output.distance).near(0.1)
    console.log(output);
  });

  it('TimeOfImpact', function() {
    var c1 = CCDTest_Circle(1);

    var input = new TOIInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);

    input.sweepA = new CCDTest_Sweep();
    input.sweepA = new CCDTest_Sweep();

    input.sweepA.setTransform(new Transform_Transform(Vec2_Vec2(0, 0), 0));
    input.sweepB.setTransform(new Transform_Transform(Vec2_Vec2(1.9, 0), 0));

    input.tMax = 1.0;

    var output = new TOIOutput();

    TimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new Transform_Transform(Vec2_Vec2(2, 0), 0));

    TimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new Transform_Transform(Vec2_Vec2(2.1, 0), 0));

    TimeOfImpact_TimeOfImpact(output, input);
    console.log(output.t, output.state);
  });

  it('Solver', function() {
  });

});
