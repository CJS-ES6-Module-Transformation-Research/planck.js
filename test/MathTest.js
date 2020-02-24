import { expect as MathTest_expect } from "./testutil/expect";
import sinon from "sinon";
import { isFinite as Mathjs_isFinite } from "../lib/common/Math";

import {
  Vec2 as MathTest_Vec2,
  skew as Vec2js_skew,
  dot as Vec2js_dot,
  cross as Vec2js_cross,
  clamp as Vec2js_clamp,
} from "../lib/common/Vec2";

describe('Math', function() {

  it('Math', function() {
    MathTest_expect(Mathjs_isFinite(+'NaN')).be(false);
    MathTest_expect(Mathjs_isFinite(Infinity)).be(false);
    MathTest_expect(Mathjs_isFinite('0')).be(false);
    MathTest_expect(Mathjs_isFinite('')).be(false);

    MathTest_expect(Mathjs_isFinite(1)).be(true);
    MathTest_expect(Mathjs_isFinite(0)).be(true);
    MathTest_expect(Mathjs_isFinite(-1)).be(true);

    // InvSqrt
    // NextPowerOfTwo
    // IsPowerOfTwo
    // clamp
    // EPSILON
  });

  it('Vec2', function() {
    var r, v = new MathTest_Vec2();
    MathTest_expect(v.x).be(0);
    MathTest_expect(v.y).be(0);

    v.set(3, 4);
    MathTest_expect(v.x).be(3);
    MathTest_expect(v.y).be(4);
    MathTest_expect(v.length()).be(5);
    MathTest_expect(v.lengthSquared()).be(25);

    v.normalize(3, 4);
    MathTest_expect(v.x).near(3 / 5);
    MathTest_expect(v.y).near(4 / 5);

    v.setZero();
    MathTest_expect(v.x).be(0);
    MathTest_expect(v.y).be(0);

    v.add(new MathTest_Vec2(3, 2));
    MathTest_expect(v.x).be(3);
    MathTest_expect(v.y).be(2);

    v.sub(new MathTest_Vec2(2, 1));
    MathTest_expect(v.x).be(1);
    MathTest_expect(v.y).be(1);

    v.mul(5);
    MathTest_expect(v.x).be(5);
    MathTest_expect(v.y).be(5);

    v.set(2, 3);
    MathTest_expect(v.x).be(2);
    MathTest_expect(v.y).be(3);

    r = Vec2js_skew(v);
    MathTest_expect(r.x).be(-3);
    MathTest_expect(r.y).be(2);

    r = Vec2js_dot(v, new MathTest_Vec2(2, 3));
    MathTest_expect(r).be(13);

    r = Vec2js_cross(v, new MathTest_Vec2(2, 3));
    MathTest_expect(r).be(0);

    r = Vec2js_cross(v, 5);
    MathTest_expect(r.x).be(15);
    MathTest_expect(r.y).be(-10);

    r = Vec2js_clamp(MathTest_Vec2(6, 8), 5);
    MathTest_expect(r.x).near(3);
    MathTest_expect(r.y).near(4);

  });

  it('Vec3', function() {
    return;

    var r, v = MathTest_Vec2();
    MathTest_expect(v.x).be(0);
    MathTest_expect(v.y).be(0);
    MathTest_expect(v.z).be(0);

    v = MathTest_Vec2(3, 4, 5);
    MathTest_expect(v.x).be(3);
    MathTest_expect(v.y).be(4);
    MathTest_expect(v.z).be(5);

    v.setZero();
    MathTest_expect(v.x).be(0);
    MathTest_expect(v.y).be(0);
    MathTest_expect(v.z).be(0);

    v.add(MathTest_Vec2(3, 2, 1));
    MathTest_expect(v.x).be(3);
    MathTest_expect(v.y).be(2);
    MathTest_expect(v.z).be(1);

    v.sub(MathTest_Vec2(0, 1, 2));
    MathTest_expect(v.x).be(3);
    MathTest_expect(v.y).be(1);
    MathTest_expect(v.z).be(-1);

    v.mul(5);
    MathTest_expect(v.x).be(15);
    MathTest_expect(v.y).be(5);
    MathTest_expect(v.z).be(-5);

    v.set(2, 3, 4);
    MathTest_expect(v.x).be(2);
    MathTest_expect(v.y).be(3);
    MathTest_expect(v.z).be(4);

    r = Vec2js_dot(v, MathTest_Vec2(2, 0, -1));
    MathTest_expect(r).be(0);

    r = Vec2js_cross(v, MathTest_Vec2(2, 0, -1));
    MathTest_expect(r.x).be(-3);
    MathTest_expect(r.y).be(10);
    MathTest_expect(r.z).be(-6);
  });
});
