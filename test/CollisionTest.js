import { expect as expect_expect } from "./testutil/expect";
import { Vec2 as Vec2_Vec2 } from "../lib/common/Vec2";
import { AABB as AABB_AABB } from "../lib/collision/AABB";
import { DynamicTree as DynamicTree_DynamicTree } from "../lib/collision/DynamicTree";
import { BroadPhase as BroadPhase_BroadPhase } from "../lib/collision/BroadPhase";

describe('Collision', function() {

  it('AABB', function() {
    var r, o = AABB_AABB();
    expect_expect(o.isValid()).be(true);

    o.upperBound.set(10, 6);
    o.lowerBound.set(6, 4);

    r = o.getCenter();
    expect_expect(r.x).be(8);
    expect_expect(r.y).be(5);

    r = o.getExtents();
    expect_expect(r.x).be(2);
    expect_expect(r.y).be(1);

    r = o.getPerimeter();
    expect_expect(r).be(12);

    o.combine(AABB_AABB(Vec2_Vec2(7, 4), Vec2_Vec2(9, 6)));
    expect_expect(o.upperBound.x).be(10);
    expect_expect(o.upperBound.y).be(6);
    expect_expect(o.lowerBound.x).be(6);
    expect_expect(o.lowerBound.y).be(4);

    o.combine(AABB_AABB(Vec2_Vec2(5, 3), Vec2_Vec2(11, 7)));
    expect_expect(o.upperBound.x).be(11);
    expect_expect(o.upperBound.y).be(7);
    expect_expect(o.lowerBound.x).be(5);
    expect_expect(o.lowerBound.y).be(3);

    expect_expect(o.contains(AABB_AABB(Vec2_Vec2(5, 3), Vec2_Vec2(11, 7)))).be(true);
    expect_expect(o.contains(AABB_AABB(Vec2_Vec2(5, 2), Vec2_Vec2(11, 7)))).be(false);
    expect_expect(o.contains(AABB_AABB(Vec2_Vec2(4, 2), Vec2_Vec2(11, 7)))).be(false);
    expect_expect(o.contains(AABB_AABB(Vec2_Vec2(5, 3), Vec2_Vec2(11, 8)))).be(false);
    expect_expect(o.contains(AABB_AABB(Vec2_Vec2(5, 3), Vec2_Vec2(12, 7)))).be(false);

    // rayCast
  });

  it('DynamicTree', function() {
    var tree = new DynamicTree_DynamicTree();

    var foo = tree.createProxy(AABB_AABB(Vec2_Vec2(0, 0), Vec2_Vec2(1, 1)), 'foo');
    var bar = tree.createProxy(AABB_AABB(Vec2_Vec2(1, 1), Vec2_Vec2(2, 2)), 'bar');
    var baz = tree.createProxy(AABB_AABB(Vec2_Vec2(2, 2), Vec2_Vec2(3, 3)), 'baz');

    expect_expect(tree.getHeight()).be(2);

    expect_expect(tree.getUserData(foo)).be('foo');
    expect_expect(tree.getUserData(bar)).be('bar');
    expect_expect(tree.getUserData(baz)).be('baz');

    expect_expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
    expect_expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
    expect_expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    expect_expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);

    var QueryCallback = sinon.spy();
    var callback = QueryCallback;

    tree.query(AABB_AABB(Vec2_Vec2(1, 1), Vec2_Vec2(2, 2)), callback);
    expect_expect(QueryCallback.calledWith(foo)).be(true);
    expect_expect(QueryCallback.calledWith(bar)).be(true);
    expect_expect(QueryCallback.calledWith(baz)).be(true);

    tree.query(AABB_AABB(Vec2_Vec2(0.3, 0.3), Vec2_Vec2(0.7, 0.7)),callback);
    expect_expect(QueryCallback.lastCall.calledWith(foo)).be(true);

    tree.query(AABB_AABB(Vec2_Vec2(1.3, 1.3), Vec2_Vec2(1.7, 1.7)), callback);
    expect_expect(QueryCallback.lastCall.calledWith(bar)).be(true);

    tree.query(AABB_AABB(Vec2_Vec2(2.3, 2.3), Vec2_Vec2(2.7, 2.7)), callback);
    expect_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    expect_expect(tree.moveProxy(foo, AABB_AABB(Vec2_Vec2(0, 0), Vec2_Vec2(1, 1)), Vec2_Vec2(0.01, 0.01))).be(false);

    expect_expect(tree.moveProxy(baz, AABB_AABB(Vec2_Vec2(3, 3), Vec2_Vec2(4, 4)), Vec2_Vec2(0, 0))).be(true);

    tree.query(AABB_AABB(Vec2_Vec2(3.3, 3.3), Vec2_Vec2(3.7, 3.7)), callback);
    expect_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    tree.destroyProxy(foo);
    expect_expect(tree.getHeight()).be(1);

    tree.destroyProxy(bar);
    expect_expect(tree.getHeight()).be(0);

    tree.destroyProxy(baz);
    expect_expect(tree.getHeight()).be(0);

  });

  it('BroadPhase', function() {
    var bp = new BroadPhase_BroadPhase();

    var AddPair = sinon.spy();
    var callback = AddPair;

    var foo = bp.createProxy(AABB_AABB(Vec2_Vec2(0, 0), Vec2_Vec2(1, 1)), 'foo');
    var bar = bp.createProxy(AABB_AABB(Vec2_Vec2(2, 2), Vec2_Vec2(3, 3)), 'bar');

    bp.updatePairs(callback);
    expect_expect(AddPair.callCount).be(0);

    var baz = bp.createProxy(AABB_AABB(Vec2_Vec2(1, 1), Vec2_Vec2(2, 2)), 'baz');

    AddPair.reset();
    bp.updatePairs(callback);
    expect_expect(AddPair.callCount).be(2);
    expect_expect(AddPair.calledWith('bar', 'baz')).be(true);
    expect_expect(AddPair.calledWith('foo', 'baz')).be(true);

    bp.moveProxy(baz, AABB_AABB(Vec2_Vec2(0.5, 0.5), Vec2_Vec2(1.5, 1.5)), Vec2_Vec2());

    AddPair.reset();
    bp.updatePairs(callback);
    expect_expect(AddPair.callCount).be(1);
    expect_expect(AddPair.calledWith('foo', 'baz')).be(true);

  });

});
