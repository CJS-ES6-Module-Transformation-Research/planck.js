var _expect = require("./testutil/expect");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _Vec = require("../lib/common/Vec2");

var _Transform = require("../lib/common/Transform");

var _Sweep = require("../lib/common/Sweep");

var _CircleShape = require("../lib/shape/CircleShape");

var _TimeOfImpact = require("../lib/collision/TimeOfImpact");

var _Distance = require("../lib/collision/Distance");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var TOIInput = _TimeOfImpact.TimeOfImpact.Input;
var TOIOutput = _TimeOfImpact.TimeOfImpact.Output;

var DistanceInput = _Distance.Distance.Input;
var DistanceOutput = _Distance.Distance.Output;
var DistanceProxy = _Distance.Distance.Proxy;
var SimplexCache = _Distance.Distance.Cache;

describe('CCD', function () {

    it('Distance', function () {
        var c1 = (0, _CircleShape.CircleShape)(1);

        var input = new DistanceInput();
        input.proxyA.set(c1, 0);
        input.proxyB.set(c1, 0);
        input.transformA = new _Transform.Transform((0, _Vec.Vec2)(0, 0), 0);
        input.transformB = new _Transform.Transform((0, _Vec.Vec2)(1.9, 0), 0);
        input.useRadii = true;
        var cache = new SimplexCache();
        var output = new DistanceOutput();
        (0, _Distance.Distance)(output, cache, input);

        (0, _expect.expect)(output.distance).be(0);
        console.log(output);

        var input = new DistanceInput();
        input.proxyA.set(c1, 0);
        input.proxyB.set(c1, 0);
        input.transformA = new _Transform.Transform((0, _Vec.Vec2)(0, 0), 0);
        input.transformB = new _Transform.Transform((0, _Vec.Vec2)(2.1, 0), 0);
        input.useRadii = true;
        var cache = new SimplexCache();
        var output = new DistanceOutput();
        (0, _Distance.Distance)(output, cache, input);

        (0, _expect.expect)(output.distance).near(0.1);
        console.log(output);
    });

    it('TimeOfImpact', function () {
        var c1 = (0, _CircleShape.CircleShape)(1);

        var input = new TOIInput();
        input.proxyA.set(c1, 0);
        input.proxyB.set(c1, 0);

        input.sweepA = new _Sweep.Sweep();
        input.sweepA = new _Sweep.Sweep();

        input.sweepA.setTransform(new _Transform.Transform((0, _Vec.Vec2)(0, 0), 0));
        input.sweepB.setTransform(new _Transform.Transform((0, _Vec.Vec2)(1.9, 0), 0));

        input.tMax = 1.0;

        var output = new TOIOutput();

        (0, _TimeOfImpact.TimeOfImpact)(output, input);
        console.log(output.t, output.state);

        input.sweepB.setTransform(new _Transform.Transform((0, _Vec.Vec2)(2, 0), 0));

        (0, _TimeOfImpact.TimeOfImpact)(output, input);
        console.log(output.t, output.state);

        input.sweepB.setTransform(new _Transform.Transform((0, _Vec.Vec2)(2.1, 0), 0));

        (0, _TimeOfImpact.TimeOfImpact)(output, input);
        console.log(output.t, output.state);
    });

    it('Solver', function () {});
});
