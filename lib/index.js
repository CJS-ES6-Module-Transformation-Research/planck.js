"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexjs = undefined;

var _Math = require("./common/Math");

var _Vec = require("./common/Vec2");

var _Vec2 = require("./common/Vec3");

var _Mat = require("./common/Mat22");

var _Mat2 = require("./common/Mat33");

var _Transform = require("./common/Transform");

var _Rot = require("./common/Rot");

var _AABB = require("./collision/AABB");

var _Shape = require("./Shape");

var _Fixture = require("./Fixture");

var _Body = require("./Body");

var _Contact = require("./Contact");

var _Joint = require("./Joint");

var _World = require("./World");

var _CircleShape = require("./shape/CircleShape");

var _EdgeShape = require("./shape/EdgeShape");

var _PolygonShape = require("./shape/PolygonShape");

var _ChainShape = require("./shape/ChainShape");

var _BoxShape = require("./shape/BoxShape");

var _CollidePolygon = require("./shape/CollidePolygon");

var _DistanceJoint = require("./joint/DistanceJoint");

var _FrictionJoint = require("./joint/FrictionJoint");

var _GearJoint = require("./joint/GearJoint");

var _MotorJoint = require("./joint/MotorJoint");

var _MouseJoint = require("./joint/MouseJoint");

var _PrismaticJoint = require("./joint/PrismaticJoint");

var _PulleyJoint = require("./joint/PulleyJoint");

var _RevoluteJoint = require("./joint/RevoluteJoint");

var _RopeJoint = require("./joint/RopeJoint");

var _WeldJoint = require("./joint/WeldJoint");

var _WheelJoint = require("./joint/WheelJoint");

var _Sweep = require("./common/Sweep");

var _stats = require("./common/stats");

var _Manifold = require("./Manifold");

var _Distance = require("./collision/Distance");

var _TimeOfImpact = require("./collision/TimeOfImpact");

var _DynamicTree = require("./collision/DynamicTree");

var _Settings = require("./Settings");

require("./shape/CollideCircle");

require("./shape/CollideEdgeCircle");

require("./shape/CollideCirclePolygone");

require("./shape/CollideEdgePolygon");

var mod_indexjs = {};
mod_indexjs.internal = {};

mod_indexjs.Math = _Math.math;
mod_indexjs.Vec2 = _Vec.Vec2;
mod_indexjs.Vec3 = _Vec2.Vec3;
mod_indexjs.Mat22 = _Mat.Mat22;
mod_indexjs.Mat33 = _Mat2.Mat33;
mod_indexjs.Transform = _Transform.Transform;
mod_indexjs.Rot = _Rot.Rot;

mod_indexjs.AABB = _AABB.AABB;

mod_indexjs.Shape = _Shape.Shape;
mod_indexjs.Fixture = _Fixture.Fixture;
mod_indexjs.Body = _Body.Body;
mod_indexjs.Contact = _Contact.Contact;
mod_indexjs.Joint = _Joint.Joint;
mod_indexjs.World = _World.World;

mod_indexjs.Circle = _CircleShape.CircleShape;
mod_indexjs.Edge = _EdgeShape.EdgeShape;
mod_indexjs.Polygon = _PolygonShape.PolygonShape;
mod_indexjs.Chain = _ChainShape.ChainShape;
mod_indexjs.Box = _BoxShape.BoxShape;

mod_indexjs.internal.CollidePolygons = _CollidePolygon.CollidePolygons;

mod_indexjs.DistanceJoint = _DistanceJoint.DistanceJoint;
mod_indexjs.FrictionJoint = _FrictionJoint.FrictionJoint;
mod_indexjs.GearJoint = _GearJoint.GearJoint;
mod_indexjs.MotorJoint = _MotorJoint.MotorJoint;
mod_indexjs.MouseJoint = _MouseJoint.MouseJoint;
mod_indexjs.PrismaticJoint = _PrismaticJoint.PrismaticJoint;
mod_indexjs.PulleyJoint = _PulleyJoint.PulleyJoint;
mod_indexjs.RevoluteJoint = _RevoluteJoint.RevoluteJoint;
mod_indexjs.RopeJoint = _RopeJoint.RopeJoint;
mod_indexjs.WeldJoint = _WeldJoint.WeldJoint;
mod_indexjs.WheelJoint = _WheelJoint.WheelJoint;

mod_indexjs.internal.Sweep = _Sweep.Sweep;
mod_indexjs.internal.stats = _stats.statsjs;
mod_indexjs.internal.Manifold = _Manifold.Manifold;
mod_indexjs.internal.Distance = _Distance.Distance;
mod_indexjs.internal.TimeOfImpact = _TimeOfImpact.TimeOfImpact;
mod_indexjs.internal.DynamicTree = _DynamicTree.DynamicTree;
mod_indexjs.internal.Settings = _Settings.Settings;
exports.indexjs = mod_indexjs;