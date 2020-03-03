"use strict";

var _expect = require("./testutil/expect");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _Vec = require("../lib/common/Vec2");

var _AABB = require("../lib/collision/AABB");

var _DynamicTree = require("../lib/collision/DynamicTree");

var _BroadPhase = require("../lib/collision/BroadPhase");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Collision', function () {

    it('AABB', function () {
        var r,
            o = (0, _AABB.AABB)();
        (0, _expect.expect)(o.isValid()).be(true);

        o.upperBound.set(10, 6);
        o.lowerBound.set(6, 4);

        r = o.getCenter();
        (0, _expect.expect)(r.x).be(8);
        (0, _expect.expect)(r.y).be(5);

        r = o.getExtents();
        (0, _expect.expect)(r.x).be(2);
        (0, _expect.expect)(r.y).be(1);

        r = o.getPerimeter();
        (0, _expect.expect)(r).be(12);

        o.combine((0, _AABB.AABB)((0, _Vec.Vec2)(7, 4), (0, _Vec.Vec2)(9, 6)));
        (0, _expect.expect)(o.upperBound.x).be(10);
        (0, _expect.expect)(o.upperBound.y).be(6);
        (0, _expect.expect)(o.lowerBound.x).be(6);
        (0, _expect.expect)(o.lowerBound.y).be(4);

        o.combine((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 7)));
        (0, _expect.expect)(o.upperBound.x).be(11);
        (0, _expect.expect)(o.upperBound.y).be(7);
        (0, _expect.expect)(o.lowerBound.x).be(5);
        (0, _expect.expect)(o.lowerBound.y).be(3);

        (0, _expect.expect)(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 7)))).be(true);
        (0, _expect.expect)(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 2), (0, _Vec.Vec2)(11, 7)))).be(false);
        (0, _expect.expect)(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(4, 2), (0, _Vec.Vec2)(11, 7)))).be(false);
        (0, _expect.expect)(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 8)))).be(false);
        (0, _expect.expect)(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(12, 7)))).be(false);

        // rayCast
    });

    it('DynamicTree', function () {
        var tree = new _DynamicTree.DynamicTree();

        var foo = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), 'foo');
        var bar = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), 'bar');
        var baz = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(2, 2), (0, _Vec.Vec2)(3, 3)), 'baz');

        (0, _expect.expect)(tree.getHeight()).be(2);

        (0, _expect.expect)(tree.getUserData(foo)).be('foo');
        (0, _expect.expect)(tree.getUserData(bar)).be('bar');
        (0, _expect.expect)(tree.getUserData(baz)).be('baz');

        (0, _expect.expect)(tree.getFatAABB(foo).upperBound.x).be.above(1);
        (0, _expect.expect)(tree.getFatAABB(foo).upperBound.y).be.above(1);
        (0, _expect.expect)(tree.getFatAABB(foo).lowerBound.x).be.below(0);
        (0, _expect.expect)(tree.getFatAABB(foo).lowerBound.y).be.below(0);

        var QueryCallback = _sinon2.default.spy();
        var callback = QueryCallback;

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), callback);
        (0, _expect.expect)(QueryCallback.calledWith(foo)).be(true);
        (0, _expect.expect)(QueryCallback.calledWith(bar)).be(true);
        (0, _expect.expect)(QueryCallback.calledWith(baz)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(0.3, 0.3), (0, _Vec.Vec2)(0.7, 0.7)), callback);
        (0, _expect.expect)(QueryCallback.lastCall.calledWith(foo)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(1.3, 1.3), (0, _Vec.Vec2)(1.7, 1.7)), callback);
        (0, _expect.expect)(QueryCallback.lastCall.calledWith(bar)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(2.3, 2.3), (0, _Vec.Vec2)(2.7, 2.7)), callback);
        (0, _expect.expect)(QueryCallback.lastCall.calledWith(baz)).be(true);

        (0, _expect.expect)(tree.moveProxy(foo, (0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), (0, _Vec.Vec2)(0.01, 0.01))).be(false);

        (0, _expect.expect)(tree.moveProxy(baz, (0, _AABB.AABB)((0, _Vec.Vec2)(3, 3), (0, _Vec.Vec2)(4, 4)), (0, _Vec.Vec2)(0, 0))).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(3.3, 3.3), (0, _Vec.Vec2)(3.7, 3.7)), callback);
        (0, _expect.expect)(QueryCallback.lastCall.calledWith(baz)).be(true);

        tree.destroyProxy(foo);
        (0, _expect.expect)(tree.getHeight()).be(1);

        tree.destroyProxy(bar);
        (0, _expect.expect)(tree.getHeight()).be(0);

        tree.destroyProxy(baz);
        (0, _expect.expect)(tree.getHeight()).be(0);
    });

    it('BroadPhase', function () {
        var bp = new _BroadPhase.BroadPhase();

        var AddPair = _sinon2.default.spy();
        var callback = AddPair;

        var foo = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), 'foo');
        var bar = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(2, 2), (0, _Vec.Vec2)(3, 3)), 'bar');

        bp.updatePairs(callback);
        (0, _expect.expect)(AddPair.callCount).be(0);

        var baz = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), 'baz');

        AddPair.reset();
        bp.updatePairs(callback);
        (0, _expect.expect)(AddPair.callCount).be(2);
        (0, _expect.expect)(AddPair.calledWith('bar', 'baz')).be(true);
        (0, _expect.expect)(AddPair.calledWith('foo', 'baz')).be(true);

        bp.moveProxy(baz, (0, _AABB.AABB)((0, _Vec.Vec2)(0.5, 0.5), (0, _Vec.Vec2)(1.5, 1.5)), (0, _Vec.Vec2)());

        AddPair.reset();
        bp.updatePairs(callback);
        (0, _expect.expect)(AddPair.callCount).be(1);
        (0, _expect.expect)(AddPair.calledWith('foo', 'baz')).be(true);
    });
});