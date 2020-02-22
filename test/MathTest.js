var _expect = require("./testutil/expect");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _Math = require("../lib/common/Math");

var _Vec = require("../lib/common/Vec2");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

describe('Math', function () {

    it('Math', function () {
        (0, _expect.expect)((0, _Math.isFinite)(+'NaN')).be(false);
        (0, _expect.expect)((0, _Math.isFinite)(Infinity)).be(false);
        (0, _expect.expect)((0, _Math.isFinite)('0')).be(false);
        (0, _expect.expect)((0, _Math.isFinite)('')).be(false);

        (0, _expect.expect)((0, _Math.isFinite)(1)).be(true);
        (0, _expect.expect)((0, _Math.isFinite)(0)).be(true);
        (0, _expect.expect)((0, _Math.isFinite)(-1)).be(true);

        // InvSqrt
        // NextPowerOfTwo
        // IsPowerOfTwo
        // clamp
        // EPSILON
    });

    it('Vec2', function () {
        var r,
            v = new _Vec.Vec2();
        (0, _expect.expect)(v.x).be(0);
        (0, _expect.expect)(v.y).be(0);

        v.set(3, 4);
        (0, _expect.expect)(v.x).be(3);
        (0, _expect.expect)(v.y).be(4);
        (0, _expect.expect)(v.length()).be(5);
        (0, _expect.expect)(v.lengthSquared()).be(25);

        v.normalize(3, 4);
        (0, _expect.expect)(v.x).near(3 / 5);
        (0, _expect.expect)(v.y).near(4 / 5);

        v.setZero();
        (0, _expect.expect)(v.x).be(0);
        (0, _expect.expect)(v.y).be(0);

        v.add(new _Vec.Vec2(3, 2));
        (0, _expect.expect)(v.x).be(3);
        (0, _expect.expect)(v.y).be(2);

        v.sub(new _Vec.Vec2(2, 1));
        (0, _expect.expect)(v.x).be(1);
        (0, _expect.expect)(v.y).be(1);

        v.mul(5);
        (0, _expect.expect)(v.x).be(5);
        (0, _expect.expect)(v.y).be(5);

        v.set(2, 3);
        (0, _expect.expect)(v.x).be(2);
        (0, _expect.expect)(v.y).be(3);

        r = (0, _Vec.skew)(v);
        (0, _expect.expect)(r.x).be(-3);
        (0, _expect.expect)(r.y).be(2);

        r = (0, _Vec.dot)(v, new _Vec.Vec2(2, 3));
        (0, _expect.expect)(r).be(13);

        r = (0, _Vec.cross)(v, new _Vec.Vec2(2, 3));
        (0, _expect.expect)(r).be(0);

        r = (0, _Vec.cross)(v, 5);
        (0, _expect.expect)(r.x).be(15);
        (0, _expect.expect)(r.y).be(-10);

        r = (0, _Vec.clamp)((0, _Vec.Vec2)(6, 8), 5);
        (0, _expect.expect)(r.x).near(3);
        (0, _expect.expect)(r.y).near(4);
    });

    it('Vec3', function () {
        return;

        var r,
            v = MathTest_Vec3();
        (0, _expect.expect)(v.x).be(0);
        (0, _expect.expect)(v.y).be(0);
        (0, _expect.expect)(v.z).be(0);

        v = MathTest_Vec3(3, 4, 5);
        (0, _expect.expect)(v.x).be(3);
        (0, _expect.expect)(v.y).be(4);
        (0, _expect.expect)(v.z).be(5);

        v.setZero();
        (0, _expect.expect)(v.x).be(0);
        (0, _expect.expect)(v.y).be(0);
        (0, _expect.expect)(v.z).be(0);

        v.add(MathTest_Vec3(3, 2, 1));
        (0, _expect.expect)(v.x).be(3);
        (0, _expect.expect)(v.y).be(2);
        (0, _expect.expect)(v.z).be(1);

        v.sub(MathTest_Vec3(0, 1, 2));
        (0, _expect.expect)(v.x).be(3);
        (0, _expect.expect)(v.y).be(1);
        (0, _expect.expect)(v.z).be(-1);

        v.mul(5);
        (0, _expect.expect)(v.x).be(15);
        (0, _expect.expect)(v.y).be(5);
        (0, _expect.expect)(v.z).be(-5);

        v.set(2, 3, 4);
        (0, _expect.expect)(v.x).be(2);
        (0, _expect.expect)(v.y).be(3);
        (0, _expect.expect)(v.z).be(4);

        r = (0, _Vec.dot)(v, MathTest_Vec3(2, 0, -1));
        (0, _expect.expect)(r).be(0);

        r = (0, _Vec.cross)(v, MathTest_Vec3(2, 0, -1));
        (0, _expect.expect)(r.x).be(-3);
        (0, _expect.expect)(r.y).be(10);
        (0, _expect.expect)(r.z).be(-6);
    });
});
