import { expect as testutilexpect_expectjs } from "./testutil/expect";
import ext_sinon_sinon from "sinon";
import { Vec2 as libcommonVec2_Vec2js } from "../lib/common/Vec2";
import { AABB as libcollisionAABB_AABBjs } from "../lib/collision/AABB";
import { DynamicTree as libcollisionDynamicTree_DynamicTreejs } from "../lib/collision/DynamicTree";
import { BroadPhase as libcollisionBroadPhase_BroadPhasejs } from "../lib/collision/BroadPhase";

describe('Collision', function() {

  it('AABB', function() {
    var r, o = libcollisionAABB_AABBjs();
    testutilexpect_expectjs(o.isValid()).be(true);

    o.upperBound.set(10, 6);
    o.lowerBound.set(6, 4);

    r = o.getCenter();
    testutilexpect_expectjs(r.x).be(8);
    testutilexpect_expectjs(r.y).be(5);

    r = o.getExtents();
    testutilexpect_expectjs(r.x).be(2);
    testutilexpect_expectjs(r.y).be(1);

    r = o.getPerimeter();
    testutilexpect_expectjs(r).be(12);

    o.combine(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(7, 4), libcommonVec2_Vec2js(9, 6)));
    testutilexpect_expectjs(o.upperBound.x).be(10);
    testutilexpect_expectjs(o.upperBound.y).be(6);
    testutilexpect_expectjs(o.lowerBound.x).be(6);
    testutilexpect_expectjs(o.lowerBound.y).be(4);

    o.combine(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(5, 3), libcommonVec2_Vec2js(11, 7)));
    testutilexpect_expectjs(o.upperBound.x).be(11);
    testutilexpect_expectjs(o.upperBound.y).be(7);
    testutilexpect_expectjs(o.lowerBound.x).be(5);
    testutilexpect_expectjs(o.lowerBound.y).be(3);

    testutilexpect_expectjs(o.contains(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(5, 3), libcommonVec2_Vec2js(11, 7)))).be(true);
    testutilexpect_expectjs(o.contains(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(5, 2), libcommonVec2_Vec2js(11, 7)))).be(false);
    testutilexpect_expectjs(o.contains(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(4, 2), libcommonVec2_Vec2js(11, 7)))).be(false);
    testutilexpect_expectjs(o.contains(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(5, 3), libcommonVec2_Vec2js(11, 8)))).be(false);
    testutilexpect_expectjs(o.contains(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(5, 3), libcommonVec2_Vec2js(12, 7)))).be(false);

    // rayCast
  });

  it('DynamicTree', function() {
    var tree = new libcollisionDynamicTree_DynamicTreejs();

    var foo = tree.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(0, 0), libcommonVec2_Vec2js(1, 1)), 'foo');
    var bar = tree.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(1, 1), libcommonVec2_Vec2js(2, 2)), 'bar');
    var baz = tree.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(2, 2), libcommonVec2_Vec2js(3, 3)), 'baz');

    testutilexpect_expectjs(tree.getHeight()).be(2);

    testutilexpect_expectjs(tree.getUserData(foo)).be('foo');
    testutilexpect_expectjs(tree.getUserData(bar)).be('bar');
    testutilexpect_expectjs(tree.getUserData(baz)).be('baz');

    testutilexpect_expectjs(tree.getFatAABB(foo).upperBound.x).be.above(1);
    testutilexpect_expectjs(tree.getFatAABB(foo).upperBound.y).be.above(1);
    testutilexpect_expectjs(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    testutilexpect_expectjs(tree.getFatAABB(foo).lowerBound.y).be.below(0);

    var QueryCallback = ext_sinon_sinon.spy();
    var callback = QueryCallback;

    tree.query(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(1, 1), libcommonVec2_Vec2js(2, 2)), callback);
    testutilexpect_expectjs(QueryCallback.calledWith(foo)).be(true);
    testutilexpect_expectjs(QueryCallback.calledWith(bar)).be(true);
    testutilexpect_expectjs(QueryCallback.calledWith(baz)).be(true);

    tree.query(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(0.3, 0.3), libcommonVec2_Vec2js(0.7, 0.7)),callback);
    testutilexpect_expectjs(QueryCallback.lastCall.calledWith(foo)).be(true);

    tree.query(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(1.3, 1.3), libcommonVec2_Vec2js(1.7, 1.7)), callback);
    testutilexpect_expectjs(QueryCallback.lastCall.calledWith(bar)).be(true);

    tree.query(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(2.3, 2.3), libcommonVec2_Vec2js(2.7, 2.7)), callback);
    testutilexpect_expectjs(QueryCallback.lastCall.calledWith(baz)).be(true);

    testutilexpect_expectjs(tree.moveProxy(foo, libcollisionAABB_AABBjs(libcommonVec2_Vec2js(0, 0), libcommonVec2_Vec2js(1, 1)), libcommonVec2_Vec2js(0.01, 0.01))).be(false);

    testutilexpect_expectjs(tree.moveProxy(baz, libcollisionAABB_AABBjs(libcommonVec2_Vec2js(3, 3), libcommonVec2_Vec2js(4, 4)), libcommonVec2_Vec2js(0, 0))).be(true);

    tree.query(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(3.3, 3.3), libcommonVec2_Vec2js(3.7, 3.7)), callback);
    testutilexpect_expectjs(QueryCallback.lastCall.calledWith(baz)).be(true);

    tree.destroyProxy(foo);
    testutilexpect_expectjs(tree.getHeight()).be(1);

    tree.destroyProxy(bar);
    testutilexpect_expectjs(tree.getHeight()).be(0);

    tree.destroyProxy(baz);
    testutilexpect_expectjs(tree.getHeight()).be(0);

  });

  it('BroadPhase', function() {
    var bp = new libcollisionBroadPhase_BroadPhasejs();

    var AddPair = ext_sinon_sinon.spy();
    var callback = AddPair;

    var foo = bp.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(0, 0), libcommonVec2_Vec2js(1, 1)), 'foo');
    var bar = bp.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(2, 2), libcommonVec2_Vec2js(3, 3)), 'bar');

    bp.updatePairs(callback);
    testutilexpect_expectjs(AddPair.callCount).be(0);

    var baz = bp.createProxy(libcollisionAABB_AABBjs(libcommonVec2_Vec2js(1, 1), libcommonVec2_Vec2js(2, 2)), 'baz');

    AddPair.reset();
    bp.updatePairs(callback);
    testutilexpect_expectjs(AddPair.callCount).be(2);
    testutilexpect_expectjs(AddPair.calledWith('bar', 'baz')).be(true);
    testutilexpect_expectjs(AddPair.calledWith('foo', 'baz')).be(true);

    bp.moveProxy(baz, libcollisionAABB_AABBjs(libcommonVec2_Vec2js(0.5, 0.5), libcommonVec2_Vec2js(1.5, 1.5)), libcommonVec2_Vec2js());

    AddPair.reset();
    bp.updatePairs(callback);
    testutilexpect_expectjs(AddPair.callCount).be(1);
    testutilexpect_expectjs(AddPair.calledWith('foo', 'baz')).be(true);

  });

});
