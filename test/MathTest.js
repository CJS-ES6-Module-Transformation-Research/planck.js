import { expect as expect_expect } from "./testutil/expect";
import sinon from "sinon";
import { isFinite as Mathjs_isFinite } from "../lib/common/Math";

import {
  Vec2 as Vec2_Vec2,
  skew as Vec2js_skew,
  dot as Vec2js_dot,
  cross as Vec2js_cross,
  clamp as Vec2js_clamp,
} from "../lib/common/Vec2";

describe('Math', function() {

  it('Math', function() {
    expect_expect(Mathjs_isFinite(+'NaN')).be(false);
    expect_expect(Mathjs_isFinite(Infinity)).be(false);
    expect_expect(Mathjs_isFinite('0')).be(false);
    expect_expect(Mathjs_isFinite('')).be(false);

    expect_expect(Mathjs_isFinite(1)).be(true);
    expect_expect(Mathjs_isFinite(0)).be(true);
    expect_expect(Mathjs_isFinite(-1)).be(true);

    // InvSqrt
    // NextPowerOfTwo
    // IsPowerOfTwo
    // clamp
    // EPSILON
  });

  it('Vec2', function() {
    var r, v = new Vec2_Vec2();
    expect_expect(v.x).be(0);
    expect_expect(v.y).be(0);

    v.set(3, 4);
    expect_expect(v.x).be(3);
    expect_expect(v.y).be(4);
    expect_expect(v.length()).be(5);
    expect_expect(v.lengthSquared()).be(25);

    v.normalize(3, 4);
    expect_expect(v.x).near(3 / 5);
    expect_expect(v.y).near(4 / 5);

    v.setZero();
    expect_expect(v.x).be(0);
    expect_expect(v.y).be(0);

    v.add(new Vec2_Vec2(3, 2));
    expect_expect(v.x).be(3);
    expect_expect(v.y).be(2);

    v.sub(new Vec2_Vec2(2, 1));
    expect_expect(v.x).be(1);
    expect_expect(v.y).be(1);

    v.mul(5);
    expect_expect(v.x).be(5);
    expect_expect(v.y).be(5);

    v.set(2, 3);
    expect_expect(v.x).be(2);
    expect_expect(v.y).be(3);

    r = Vec2js_skew(v);
    expect_expect(r.x).be(-3);
    expect_expect(r.y).be(2);

    r = Vec2js_dot(v, new Vec2_Vec2(2, 3));
    expect_expect(r).be(13);

    r = Vec2js_cross(v, new Vec2_Vec2(2, 3));
    expect_expect(r).be(0);

    r = Vec2js_cross(v, 5);
    expect_expect(r.x).be(15);
    expect_expect(r.y).be(-10);

    r = Vec2js_clamp(Vec2_Vec2(6, 8), 5);
    expect_expect(r.x).near(3);
    expect_expect(r.y).near(4);

  });

  it('Vec3', function() {
    return;

    var r, v = Vec2_Vec2();
    expect_expect(v.x).be(0);
    expect_expect(v.y).be(0);
    expect_expect(v.z).be(0);

    v = Vec2_Vec2(3, 4, 5);
    expect_expect(v.x).be(3);
    expect_expect(v.y).be(4);
    expect_expect(v.z).be(5);

    v.setZero();
    expect_expect(v.x).be(0);
    expect_expect(v.y).be(0);
    expect_expect(v.z).be(0);

    v.add(Vec2_Vec2(3, 2, 1));
    expect_expect(v.x).be(3);
    expect_expect(v.y).be(2);
    expect_expect(v.z).be(1);

    v.sub(Vec2_Vec2(0, 1, 2));
    expect_expect(v.x).be(3);
    expect_expect(v.y).be(1);
    expect_expect(v.z).be(-1);

    v.mul(5);
    expect_expect(v.x).be(15);
    expect_expect(v.y).be(5);
    expect_expect(v.z).be(-5);

    v.set(2, 3, 4);
    expect_expect(v.x).be(2);
    expect_expect(v.y).be(3);
    expect_expect(v.z).be(4);

    r = Vec2js_dot(v, Vec2_Vec2(2, 0, -1));
    expect_expect(r).be(0);

    r = Vec2js_cross(v, Vec2_Vec2(2, 0, -1));
    expect_expect(r.x).be(-3);
    expect_expect(r.y).be(10);
    expect_expect(r.z).be(-6);
  });
});
