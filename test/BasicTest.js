import { expect as expect_expect } from "./testutil/expect";
import sinon from "sinon";
import { Vec2 as Vec2_Vec2 } from "../lib/common/Vec2";
import { CircleShape as BasicTest_Circle } from "../lib/shape/CircleShape";
import { World as World_World } from "../lib/World";

describe('Basic', function() {

  it('World', function() {

    var world = new World_World();

    var circle = new BasicTest_Circle(1);

    var b1 = world.createBody({
      position : Vec2_Vec2(0, 0),
      type : 'dynamic'
    });

    b1.createFixture(circle);

    expect_expect(b1.getFixtureList().getType()).be('circle');
    expect_expect(b1.getWorld()).be(world);
    expect_expect(world.getBodyList()).be(b1);

    b1.applyForceToCenter(Vec2_Vec2(1, 0), true);

    var b2 = world.createBody({
      position : Vec2_Vec2(2, 0),
      type : 'dynamic'
    });
    b2.createFixture(circle);
    b2.applyForceToCenter(Vec2_Vec2(-1, 0), true);

    world.step(1 / 20);

    // console.log(b2.getPosition());

    var p = b1.getPosition();
    expect_expect(p.x).near(0.0);
    expect_expect(p.y).near(0.0);
  });

});
