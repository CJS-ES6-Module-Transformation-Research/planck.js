import { expect as CCDTest_expect } from "./testutil/expect";
import sinon from "sinon";
import { Vec2 as CCDTest_Vec2 } from "../lib/common/Vec2";
import { Transform as CCDTest_Transform } from "../lib/common/Transform";
import { Sweep as CCDTest_Sweep } from "../lib/common/Sweep";
import { CircleShape as CCDTest_Circle } from "../lib/shape/CircleShape";
import { TimeOfImpact as CCDTest_TimeOfImpact } from "../lib/collision/TimeOfImpact";
import { Distance as CCDTest_Distance } from "../lib/collision/Distance";
var TOIInput = CCDTest_TimeOfImpact.Input;
var TOIOutput = CCDTest_TimeOfImpact.Output;

var DistanceInput = Distance.Input;
var DistanceOutput = Distance.Output;
var DistanceProxy = Distance.Proxy;
var SimplexCache = Distance.Cache;

describe('CCD', function() {

  it('Distance', function() {
    var c1 = Circle(1);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new CCDTest_Transform(CCDTest_Vec2(0, 0), 0);
    input.transformB = new CCDTest_Transform(CCDTest_Vec2(1.9, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    Distance(output, cache, input);

    CCDTest_expect(output.distance).be(0);
    console.log(output);

    var input = new DistanceInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);
    input.transformA = new CCDTest_Transform(CCDTest_Vec2(0, 0), 0);
    input.transformB = new CCDTest_Transform(CCDTest_Vec2(2.1, 0), 0);
    input.useRadii = true;
    var cache = new SimplexCache();
    var output = new DistanceOutput();
    Distance(output, cache, input);

    CCDTest_expect(output.distance).near(0.1)
    console.log(output);
  });

  it('TimeOfImpact', function() {
    var c1 = Circle(1);

    var input = new TOIInput();
    input.proxyA.set(c1, 0);
    input.proxyB.set(c1, 0);

    input.sweepA = new Sweep();
    input.sweepA = new Sweep();

    input.sweepA.setTransform(new CCDTest_Transform(CCDTest_Vec2(0, 0), 0));
    input.sweepB.setTransform(new CCDTest_Transform(CCDTest_Vec2(1.9, 0), 0));

    input.tMax = 1.0;

    var output = new TOIOutput();

    CCDTest_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new CCDTest_Transform(CCDTest_Vec2(2, 0), 0));

    CCDTest_TimeOfImpact(output, input);
    console.log(output.t, output.state);

    input.sweepB.setTransform(new CCDTest_Transform(CCDTest_Vec2(2.1, 0), 0));

    CCDTest_TimeOfImpact(output, input);
    console.log(output.t, output.state);
  });

  it('Solver', function() {
  });

});
