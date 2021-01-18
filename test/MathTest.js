import { expect as testutilexpect_expect } from "./testutil/expect";
import { isFinite as Mathjs_isFinite } from "../lib/common/Math";
import { Vec2 as libcommonVec2_Vec2 } from "../lib/common/Vec2";
var sinon = require('sinon');

describe('Math', function() {

  it('Math', function() {
    testutilexpect_expect(Mathjs_isFinite(+'NaN')).be(false);
    testutilexpect_expect(Mathjs_isFinite(Infinity)).be(false);
    testutilexpect_expect(Mathjs_isFinite('0')).be(false);
    testutilexpect_expect(Mathjs_isFinite('')).be(false);

    testutilexpect_expect(Mathjs_isFinite(1)).be(true);
    testutilexpect_expect(Mathjs_isFinite(0)).be(true);
    testutilexpect_expect(Mathjs_isFinite(-1)).be(true);

    // InvSqrt
    // NextPowerOfTwo
    // IsPowerOfTwo
    // clamp
    // EPSILON
  });

  it('Vec2', function() {
    var r, v = new libcommonVec2_Vec2();
    testutilexpect_expect(v.x).be(0);
    testutilexpect_expect(v.y).be(0);

    v.set(3, 4);
    testutilexpect_expect(v.x).be(3);
    testutilexpect_expect(v.y).be(4);
    testutilexpect_expect(v.length()).be(5);
    testutilexpect_expect(v.lengthSquared()).be(25);

    v.normalize(3, 4);
    testutilexpect_expect(v.x).near(3 / 5);
    testutilexpect_expect(v.y).near(4 / 5);

    v.setZero();
    testutilexpect_expect(v.x).be(0);
    testutilexpect_expect(v.y).be(0);

    v.add(new libcommonVec2_Vec2(3, 2));
    testutilexpect_expect(v.x).be(3);
    testutilexpect_expect(v.y).be(2);

    v.sub(new libcommonVec2_Vec2(2, 1));
    testutilexpect_expect(v.x).be(1);
    testutilexpect_expect(v.y).be(1);

    v.mul(5);
    testutilexpect_expect(v.x).be(5);
    testutilexpect_expect(v.y).be(5);

    v.set(2, 3);
    testutilexpect_expect(v.x).be(2);
    testutilexpect_expect(v.y).be(3);

    r = libcommonVec2_Vec2.skew(v);
    testutilexpect_expect(r.x).be(-3);
    testutilexpect_expect(r.y).be(2);

    r = libcommonVec2_Vec2.dot(v, new libcommonVec2_Vec2(2, 3));
    testutilexpect_expect(r).be(13);

    r = libcommonVec2_Vec2.cross(v, new libcommonVec2_Vec2(2, 3));
    testutilexpect_expect(r).be(0);

    r = libcommonVec2_Vec2.cross(v, 5);
    testutilexpect_expect(r.x).be(15);
    testutilexpect_expect(r.y).be(-10);

    r = libcommonVec2_Vec2.clamp(libcommonVec2_Vec2(6, 8), 5);
    testutilexpect_expect(r.x).near(3);
    testutilexpect_expect(r.y).near(4);

  });

  it('Vec3', function() {
    return;

    var r, v = libcommonVec2_Vec2();
    testutilexpect_expect(v.x).be(0);
    testutilexpect_expect(v.y).be(0);
    testutilexpect_expect(v.z).be(0);

    v = libcommonVec2_Vec2(3, 4, 5);
    testutilexpect_expect(v.x).be(3);
    testutilexpect_expect(v.y).be(4);
    testutilexpect_expect(v.z).be(5);

    v.setZero();
    testutilexpect_expect(v.x).be(0);
    testutilexpect_expect(v.y).be(0);
    testutilexpect_expect(v.z).be(0);

    v.add(libcommonVec2_Vec2(3, 2, 1));
    testutilexpect_expect(v.x).be(3);
    testutilexpect_expect(v.y).be(2);
    testutilexpect_expect(v.z).be(1);

    v.sub(libcommonVec2_Vec2(0, 1, 2));
    testutilexpect_expect(v.x).be(3);
    testutilexpect_expect(v.y).be(1);
    testutilexpect_expect(v.z).be(-1);

    v.mul(5);
    testutilexpect_expect(v.x).be(15);
    testutilexpect_expect(v.y).be(5);
    testutilexpect_expect(v.z).be(-5);

    v.set(2, 3, 4);
    testutilexpect_expect(v.x).be(2);
    testutilexpect_expect(v.y).be(3);
    testutilexpect_expect(v.z).be(4);

    r = libcommonVec2_Vec2.dot(v, libcommonVec2_Vec2(2, 0, -1));
    testutilexpect_expect(r).be(0);

    r = libcommonVec2_Vec2.cross(v, libcommonVec2_Vec2(2, 0, -1));
    testutilexpect_expect(r.x).be(-3);
    testutilexpect_expect(r.y).be(10);
    testutilexpect_expect(r.z).be(-6);
  });
});
