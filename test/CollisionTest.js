var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _Vec = require("../lib/common/Vec2");

var _AABB = require("../lib/collision/AABB");

var _DynamicTree = require("../lib/collision/DynamicTree");

var _BroadPhase = require("../lib/collision/BroadPhase");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var expect = require('./testutil/expect');

describe('Collision', function () {

    it('AABB', function () {
        var r,
            o = (0, _AABB.AABB)();
        expect(o.isValid()).be(true);

        o.upperBound.set(10, 6);
        o.lowerBound.set(6, 4);

        r = o.getCenter();
        expect(r.x).be(8);
        expect(r.y).be(5);

        r = o.getExtents();
        expect(r.x).be(2);
        expect(r.y).be(1);

        r = o.getPerimeter();
        expect(r).be(12);

        o.combine((0, _AABB.AABB)((0, _Vec.Vec2)(7, 4), (0, _Vec.Vec2)(9, 6)));
        expect(o.upperBound.x).be(10);
        expect(o.upperBound.y).be(6);
        expect(o.lowerBound.x).be(6);
        expect(o.lowerBound.y).be(4);

        o.combine((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 7)));
        expect(o.upperBound.x).be(11);
        expect(o.upperBound.y).be(7);
        expect(o.lowerBound.x).be(5);
        expect(o.lowerBound.y).be(3);

        expect(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 7)))).be(true);
        expect(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 2), (0, _Vec.Vec2)(11, 7)))).be(false);
        expect(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(4, 2), (0, _Vec.Vec2)(11, 7)))).be(false);
        expect(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(11, 8)))).be(false);
        expect(o.contains((0, _AABB.AABB)((0, _Vec.Vec2)(5, 3), (0, _Vec.Vec2)(12, 7)))).be(false);

        // rayCast
    });

    it('DynamicTree', function () {
        var tree = new _DynamicTree.DynamicTree();

        var foo = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), 'foo');
        var bar = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), 'bar');
        var baz = tree.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(2, 2), (0, _Vec.Vec2)(3, 3)), 'baz');

        expect(tree.getHeight()).be(2);

        expect(tree.getUserData(foo)).be('foo');
        expect(tree.getUserData(bar)).be('bar');
        expect(tree.getUserData(baz)).be('baz');

        expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
        expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
        expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
        expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);

        var QueryCallback = _sinon2.default.spy();
        var callback = QueryCallback;

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), callback);
        expect(QueryCallback.calledWith(foo)).be(true);
        expect(QueryCallback.calledWith(bar)).be(true);
        expect(QueryCallback.calledWith(baz)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(0.3, 0.3), (0, _Vec.Vec2)(0.7, 0.7)), callback);
        expect(QueryCallback.lastCall.calledWith(foo)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(1.3, 1.3), (0, _Vec.Vec2)(1.7, 1.7)), callback);
        expect(QueryCallback.lastCall.calledWith(bar)).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(2.3, 2.3), (0, _Vec.Vec2)(2.7, 2.7)), callback);
        expect(QueryCallback.lastCall.calledWith(baz)).be(true);

        expect(tree.moveProxy(foo, (0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), (0, _Vec.Vec2)(0.01, 0.01))).be(false);

        expect(tree.moveProxy(baz, (0, _AABB.AABB)((0, _Vec.Vec2)(3, 3), (0, _Vec.Vec2)(4, 4)), (0, _Vec.Vec2)(0, 0))).be(true);

        tree.query((0, _AABB.AABB)((0, _Vec.Vec2)(3.3, 3.3), (0, _Vec.Vec2)(3.7, 3.7)), callback);
        expect(QueryCallback.lastCall.calledWith(baz)).be(true);

        tree.destroyProxy(foo);
        expect(tree.getHeight()).be(1);

        tree.destroyProxy(bar);
        expect(tree.getHeight()).be(0);

        tree.destroyProxy(baz);
        expect(tree.getHeight()).be(0);
    });

    it('BroadPhase', function () {
        var bp = new _BroadPhase.BroadPhase();

        var AddPair = _sinon2.default.spy();
        var callback = AddPair;

        var foo = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(0, 0), (0, _Vec.Vec2)(1, 1)), 'foo');
        var bar = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(2, 2), (0, _Vec.Vec2)(3, 3)), 'bar');

        bp.updatePairs(callback);
        expect(AddPair.callCount).be(0);

        var baz = bp.createProxy((0, _AABB.AABB)((0, _Vec.Vec2)(1, 1), (0, _Vec.Vec2)(2, 2)), 'baz');

        AddPair.reset();
        bp.updatePairs(callback);
        expect(AddPair.callCount).be(2);
        expect(AddPair.calledWith('bar', 'baz')).be(true);
        expect(AddPair.calledWith('foo', 'baz')).be(true);

        bp.moveProxy(baz, (0, _AABB.AABB)((0, _Vec.Vec2)(0.5, 0.5), (0, _Vec.Vec2)(1.5, 1.5)), (0, _Vec.Vec2)());

        AddPair.reset();
        bp.updatePairs(callback);
        expect(AddPair.callCount).be(1);
        expect(AddPair.calledWith('foo', 'baz')).be(true);
    });
});
