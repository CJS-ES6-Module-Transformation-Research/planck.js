import { expect as testutilexpect_expect } from "./testutil/expect";
import { Vec2 as libcommonVec2_Vec2 } from "../lib/common/Vec2";
import { CircleShape as libshapeCircleShape_CircleShape } from "../lib/shape/CircleShape";
import { World as libWorld_World } from "../lib/World";
var sinon = require('sinon');

describe('Basic', function() {

  it('World', function() {

    var world = new libWorld_World();

    var circle = new libshapeCircleShape_CircleShape(1);

    var b1 = world.createBody({
      position : libcommonVec2_Vec2(0, 0),
      type : 'dynamic'
    });

    b1.createFixture(circle);

    testutilexpect_expect(b1.getFixtureList().getType()).be('circle');
    testutilexpect_expect(b1.getWorld()).be(world);
    testutilexpect_expect(world.getBodyList()).be(b1);

    b1.applyForceToCenter(libcommonVec2_Vec2(1, 0), true);

    var b2 = world.createBody({
      position : libcommonVec2_Vec2(2, 0),
      type : 'dynamic'
    });
    b2.createFixture(circle);
    b2.applyForceToCenter(libcommonVec2_Vec2(-1, 0), true);

    world.step(1 / 20);

    // console.log(b2.getPosition());

    var p = b1.getPosition();
    testutilexpect_expect(p.x).near(0.0);
    testutilexpect_expect(p.y).near(0.0);
  });

});
