import { expect as testutilexpect_expectjs } from "./testutil/expect";
import ext_sinon_sinon from "sinon";
import { Vec2 as libcommonVec2_Vec2js } from "../lib/common/Vec2";
import { CircleShape as libshapeCircleShape_CircleShapejs } from "../lib/shape/CircleShape";
import { World as libWorld_Worldjs } from "../lib/World";

describe('Basic', function() {

  it('World', function() {

    var world = new libWorld_Worldjs();

    var circle = new libshapeCircleShape_CircleShapejs(1);

    var b1 = world.createBody({
      position : libcommonVec2_Vec2js(0, 0),
      type : 'dynamic'
    });

    b1.createFixture(circle);

    testutilexpect_expectjs(b1.getFixtureList().getType()).be('circle');
    testutilexpect_expectjs(b1.getWorld()).be(world);
    testutilexpect_expectjs(world.getBodyList()).be(b1);

    b1.applyForceToCenter(libcommonVec2_Vec2js(1, 0), true);

    var b2 = world.createBody({
      position : libcommonVec2_Vec2js(2, 0),
      type : 'dynamic'
    });
    b2.createFixture(circle);
    b2.applyForceToCenter(libcommonVec2_Vec2js(-1, 0), true);

    world.step(1 / 20);

    // console.log(b2.getPosition());

    var p = b1.getPosition();
    testutilexpect_expectjs(p.x).near(0.0);
    testutilexpect_expectjs(p.y).near(0.0);
  });

});
