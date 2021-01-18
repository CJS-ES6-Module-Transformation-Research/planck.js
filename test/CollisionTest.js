import { expect as testutilexpect_expect } from "./testutil/expect";
import { Vec2 as libcommonVec2_Vec2 } from "../lib/common/Vec2";
import { AABB as libcollisionAABB_AABB } from "../lib/collision/AABB";
import { DynamicTree as libcollisionDynamicTree_DynamicTree } from "../lib/collision/DynamicTree";
import { BroadPhase as libcollisionBroadPhase_BroadPhase } from "../lib/collision/BroadPhase";
var sinon = require('sinon');

describe('Collision', function() {

  it('AABB', function() {
    var r, o = libcollisionAABB_AABB();
    testutilexpect_expect(o.isValid()).be(true);

    o.upperBound.set(10, 6);
    o.lowerBound.set(6, 4);

    r = o.getCenter();
    testutilexpect_expect(r.x).be(8);
    testutilexpect_expect(r.y).be(5);

    r = o.getExtents();
    testutilexpect_expect(r.x).be(2);
    testutilexpect_expect(r.y).be(1);

    r = o.getPerimeter();
    testutilexpect_expect(r).be(12);

    o.combine(libcollisionAABB_AABB(libcommonVec2_Vec2(7, 4), libcommonVec2_Vec2(9, 6)));
    testutilexpect_expect(o.upperBound.x).be(10);
    testutilexpect_expect(o.upperBound.y).be(6);
    testutilexpect_expect(o.lowerBound.x).be(6);
    testutilexpect_expect(o.lowerBound.y).be(4);

    o.combine(libcollisionAABB_AABB(libcommonVec2_Vec2(5, 3), libcommonVec2_Vec2(11, 7)));
    testutilexpect_expect(o.upperBound.x).be(11);
    testutilexpect_expect(o.upperBound.y).be(7);
    testutilexpect_expect(o.lowerBound.x).be(5);
    testutilexpect_expect(o.lowerBound.y).be(3);

    testutilexpect_expect(o.contains(libcollisionAABB_AABB(libcommonVec2_Vec2(5, 3), libcommonVec2_Vec2(11, 7)))).be(true);
    testutilexpect_expect(o.contains(libcollisionAABB_AABB(libcommonVec2_Vec2(5, 2), libcommonVec2_Vec2(11, 7)))).be(false);
    testutilexpect_expect(o.contains(libcollisionAABB_AABB(libcommonVec2_Vec2(4, 2), libcommonVec2_Vec2(11, 7)))).be(false);
    testutilexpect_expect(o.contains(libcollisionAABB_AABB(libcommonVec2_Vec2(5, 3), libcommonVec2_Vec2(11, 8)))).be(false);
    testutilexpect_expect(o.contains(libcollisionAABB_AABB(libcommonVec2_Vec2(5, 3), libcommonVec2_Vec2(12, 7)))).be(false);

    // rayCast
  });

  it('DynamicTree', function() {
    var tree = new libcollisionDynamicTree_DynamicTree();

    var foo = tree.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(0, 0), libcommonVec2_Vec2(1, 1)), 'foo');
    var bar = tree.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(1, 1), libcommonVec2_Vec2(2, 2)), 'bar');
    var baz = tree.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(2, 2), libcommonVec2_Vec2(3, 3)), 'baz');

    testutilexpect_expect(tree.getHeight()).be(2);

    testutilexpect_expect(tree.getUserData(foo)).be('foo');
    testutilexpect_expect(tree.getUserData(bar)).be('bar');
    testutilexpect_expect(tree.getUserData(baz)).be('baz');

    testutilexpect_expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
    testutilexpect_expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
    testutilexpect_expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    testutilexpect_expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);

    var QueryCallback = sinon.spy();
    var callback = QueryCallback;

    tree.query(libcollisionAABB_AABB(libcommonVec2_Vec2(1, 1), libcommonVec2_Vec2(2, 2)), callback);
    testutilexpect_expect(QueryCallback.calledWith(foo)).be(true);
    testutilexpect_expect(QueryCallback.calledWith(bar)).be(true);
    testutilexpect_expect(QueryCallback.calledWith(baz)).be(true);

    tree.query(libcollisionAABB_AABB(libcommonVec2_Vec2(0.3, 0.3), libcommonVec2_Vec2(0.7, 0.7)),callback);
    testutilexpect_expect(QueryCallback.lastCall.calledWith(foo)).be(true);

    tree.query(libcollisionAABB_AABB(libcommonVec2_Vec2(1.3, 1.3), libcommonVec2_Vec2(1.7, 1.7)), callback);
    testutilexpect_expect(QueryCallback.lastCall.calledWith(bar)).be(true);

    tree.query(libcollisionAABB_AABB(libcommonVec2_Vec2(2.3, 2.3), libcommonVec2_Vec2(2.7, 2.7)), callback);
    testutilexpect_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    testutilexpect_expect(tree.moveProxy(foo, libcollisionAABB_AABB(libcommonVec2_Vec2(0, 0), libcommonVec2_Vec2(1, 1)), libcommonVec2_Vec2(0.01, 0.01))).be(false);

    testutilexpect_expect(tree.moveProxy(baz, libcollisionAABB_AABB(libcommonVec2_Vec2(3, 3), libcommonVec2_Vec2(4, 4)), libcommonVec2_Vec2(0, 0))).be(true);

    tree.query(libcollisionAABB_AABB(libcommonVec2_Vec2(3.3, 3.3), libcommonVec2_Vec2(3.7, 3.7)), callback);
    testutilexpect_expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    tree.destroyProxy(foo);
    testutilexpect_expect(tree.getHeight()).be(1);

    tree.destroyProxy(bar);
    testutilexpect_expect(tree.getHeight()).be(0);

    tree.destroyProxy(baz);
    testutilexpect_expect(tree.getHeight()).be(0);

  });

  it('BroadPhase', function() {
    var bp = new libcollisionBroadPhase_BroadPhase();

    var AddPair = sinon.spy();
    var callback = AddPair;

    var foo = bp.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(0, 0), libcommonVec2_Vec2(1, 1)), 'foo');
    var bar = bp.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(2, 2), libcommonVec2_Vec2(3, 3)), 'bar');

    bp.updatePairs(callback);
    testutilexpect_expect(AddPair.callCount).be(0);

    var baz = bp.createProxy(libcollisionAABB_AABB(libcommonVec2_Vec2(1, 1), libcommonVec2_Vec2(2, 2)), 'baz');

    AddPair.reset();
    bp.updatePairs(callback);
    testutilexpect_expect(AddPair.callCount).be(2);
    testutilexpect_expect(AddPair.calledWith('bar', 'baz')).be(true);
    testutilexpect_expect(AddPair.calledWith('foo', 'baz')).be(true);

    bp.moveProxy(baz, libcollisionAABB_AABB(libcommonVec2_Vec2(0.5, 0.5), libcommonVec2_Vec2(1.5, 1.5)), libcommonVec2_Vec2());

    AddPair.reset();
    bp.updatePairs(callback);
    testutilexpect_expect(AddPair.callCount).be(1);
    testutilexpect_expect(AddPair.calledWith('foo', 'baz')).be(true);

  });

});
