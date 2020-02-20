import { expect as CollisionTest_expect } from "./testutil/expect";
import sinon from "sinon";
import { Vec2 as CollisionTest_Vec2 } from "../lib/common/Vec2";
import { AABB as CollisionTest_AABB } from "../lib/collision/AABB";
import { DynamicTree as CollisionTest_DynamicTree } from "../lib/collision/DynamicTree";
import { BroadPhase as CollisionTest_BroadPhase } from "../lib/collision/BroadPhase";

describe('Collision', function() {

  it('AABB', function() {
    var r, o = CollisionTest_AABB();
    CollisionTest_expect(o.isValid()).be(true);

    o.upperBound.set(10, 6);
    o.lowerBound.set(6, 4);

    r = o.getCenter();
    CollisionTest_expect(r.x).be(8);
    CollisionTest_expect(r.y).be(5);

    r = o.getExtents();
    CollisionTest_expect(r.x).be(2);
    CollisionTest_expect(r.y).be(1);

    r = o.getPerimeter();
    CollisionTest_expect(r).be(12);

    o.combine(CollisionTest_AABB(CollisionTest_Vec2(7, 4), CollisionTest_Vec2(9, 6)));
    CollisionTest_expect(o.upperBound.x).be(10);
    CollisionTest_expect(o.upperBound.y).be(6);
    CollisionTest_expect(o.lowerBound.x).be(6);
    CollisionTest_expect(o.lowerBound.y).be(4);

    o.combine(CollisionTest_AABB(CollisionTest_Vec2(5, 3), CollisionTest_Vec2(11, 7)));
    CollisionTest_expect(o.upperBound.x).be(11);
    CollisionTest_expect(o.upperBound.y).be(7);
    CollisionTest_expect(o.lowerBound.x).be(5);
    CollisionTest_expect(o.lowerBound.y).be(3);

    CollisionTest_expect(o.contains(CollisionTest_AABB(CollisionTest_Vec2(5, 3), CollisionTest_Vec2(11, 7)))).be(true);
    CollisionTest_expect(o.contains(CollisionTest_AABB(CollisionTest_Vec2(5, 2), CollisionTest_Vec2(11, 7)))).be(false);
    CollisionTest_expect(o.contains(CollisionTest_AABB(CollisionTest_Vec2(4, 2), CollisionTest_Vec2(11, 7)))).be(false);
    CollisionTest_expect(o.contains(CollisionTest_AABB(CollisionTest_Vec2(5, 3), CollisionTest_Vec2(11, 8)))).be(false);
    CollisionTest_expect(o.contains(CollisionTest_AABB(CollisionTest_Vec2(5, 3), CollisionTest_Vec2(12, 7)))).be(false);

    // rayCast
  });

  it('DynamicTree', function() {
    var tree = new CollisionTest_DynamicTree();

    var foo = tree.createProxy(CollisionTest_AABB(CollisionTest_Vec2(0, 0), CollisionTest_Vec2(1, 1)), 'foo');
    var bar = tree.createProxy(CollisionTest_AABB(CollisionTest_Vec2(1, 1), CollisionTest_Vec2(2, 2)), 'bar');
    var baz = tree.createProxy(CollisionTest_AABB(CollisionTest_Vec2(2, 2), CollisionTest_Vec2(3, 3)), 'baz');

    CollisionTest_expect(tree.getHeight()).be(2);

    CollisionTest_expect(tree.getUserData(foo)).be('foo');
    CollisionTest_expect(tree.getUserData(bar)).be('bar');
    CollisionTest_expect(tree.getUserData(baz)).be('baz');

    CollisionTest_expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
    CollisionTest_expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
    CollisionTest_expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    CollisionTest_expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);

    var QueryCallback = sinon.spy();
    var callback = QueryCallback;

    tree.query(CollisionTest_AABB(CollisionTest_Vec2(1, 1), CollisionTest_Vec2(2, 2)), callback);
    CollisionTest_expect(QueryCallback.calledWith(foo)).be(true);
    CollisionTest_expect(QueryCallback.calledWith(bar)).be(true);
    CollisionTest_expect(QueryCallback.calledWith(baz)).be(true);

    tree.query(CollisionTest_AABB(CollisionTest_Vec2(0.3, 0.3), CollisionTest_Vec2(0.7, 0.7)),callback);
    CollisionTest_expect(QueryCallback.lastCall.calledWith(foo)).be(true);

    tree.query(CollisionTest_AABB(CollisionTest_Vec2(1.3, 1.3), CollisionTest_Vec2(1.7, 1.7)), callback);
    CollisionTest_expect(QueryCallback.lastCall.calledWith(bar)).be(true);

    tree.query(CollisionTest_AABB(CollisionTest_Vec2(2.3, 2.3), CollisionTest_Vec2(2.7, 2.7)), callback);
    CollisionTest_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    CollisionTest_expect(tree.moveProxy(foo, CollisionTest_AABB(CollisionTest_Vec2(0, 0), CollisionTest_Vec2(1, 1)), CollisionTest_Vec2(0.01, 0.01))).be(false);

    CollisionTest_expect(tree.moveProxy(baz, CollisionTest_AABB(CollisionTest_Vec2(3, 3), CollisionTest_Vec2(4, 4)), CollisionTest_Vec2(0, 0))).be(true);

    tree.query(CollisionTest_AABB(CollisionTest_Vec2(3.3, 3.3), CollisionTest_Vec2(3.7, 3.7)), callback);
    CollisionTest_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    tree.destroyProxy(foo);
    CollisionTest_expect(tree.getHeight()).be(1);

    tree.destroyProxy(bar);
    CollisionTest_expect(tree.getHeight()).be(0);

    tree.destroyProxy(baz);
    CollisionTest_expect(tree.getHeight()).be(0);

  });

  it('BroadPhase', function() {
    var bp = new CollisionTest_BroadPhase();

    var AddPair = sinon.spy();
    var callback = AddPair;

    var foo = bp.createProxy(CollisionTest_AABB(CollisionTest_Vec2(0, 0), CollisionTest_Vec2(1, 1)), 'foo');
    var bar = bp.createProxy(CollisionTest_AABB(CollisionTest_Vec2(2, 2), CollisionTest_Vec2(3, 3)), 'bar');

    bp.updatePairs(callback);
    CollisionTest_expect(AddPair.callCount).be(0);

    var baz = bp.createProxy(CollisionTest_AABB(CollisionTest_Vec2(1, 1), CollisionTest_Vec2(2, 2)), 'baz');

    AddPair.reset();
    bp.updatePairs(callback);
    CollisionTest_expect(AddPair.callCount).be(2);
    CollisionTest_expect(AddPair.calledWith('bar', 'baz')).be(true);
    CollisionTest_expect(AddPair.calledWith('foo', 'baz')).be(true);

    bp.moveProxy(baz, CollisionTest_AABB(CollisionTest_Vec2(0.5, 0.5), CollisionTest_Vec2(1.5, 1.5)), CollisionTest_Vec2());

    AddPair.reset();
    bp.updatePairs(callback);
    CollisionTest_expect(AddPair.callCount).be(1);
    CollisionTest_expect(AddPair.calledWith('foo', 'baz')).be(true);

  });

});
