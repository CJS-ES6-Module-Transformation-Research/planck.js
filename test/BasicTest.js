"use strict";

var _expect = require("./testutil/expect");

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _Vec = require("../lib/common/Vec2");

var _CircleShape = require("../lib/shape/CircleShape");

var _World = require("../lib/World");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Basic', function () {

    it('World', function () {

        var world = new _World.World();

        var circle = new _CircleShape.CircleShape(1);

        var b1 = world.createBody({
            position: (0, _Vec.Vec2)(0, 0),
            type: 'dynamic'
        });

        b1.createFixture(circle);

        (0, _expect.expect)(b1.getFixtureList().getType()).be('circle');
        (0, _expect.expect)(b1.getWorld()).be(world);
        (0, _expect.expect)(world.getBodyList()).be(b1);

        b1.applyForceToCenter((0, _Vec.Vec2)(1, 0), true);

        var b2 = world.createBody({
            position: (0, _Vec.Vec2)(2, 0),
            type: 'dynamic'
        });
        b2.createFixture(circle);
        b2.applyForceToCenter((0, _Vec.Vec2)(-1, 0), true);

        world.step(1 / 20);

        // console.log(b2.getPosition());

        var p = b1.getPosition();
        (0, _expect.expect)(p.x).near(0.0);
        (0, _expect.expect)(p.y).near(0.0);
    });
});