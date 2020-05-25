"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WheelJoint = exports.WeldJoint = exports.RopeJoint = exports.RevoluteJoint = exports.PulleyJoint = exports.PrismaticJoint = exports.MouseJoint = exports.MotorJoint = exports.GearJoint = exports.FrictionJoint = exports.DistanceJoint = exports.Box = exports.Chain = exports.Polygon = exports.Edge = exports.Circle = exports.World = exports.Joint = exports.Contact = exports.Body = exports.Fixture = exports.Shape = exports.AABB = exports.Rot = exports.Transform = exports.Mat33 = exports.Mat22 = exports.Vec3 = exports.Vec2 = exports.Math = exports.internal = undefined;

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

var internal_internal;
exports.internal = internal_internal = {};

var Math_Math;

exports.Math = Math_Math = _Math.math;
var Vec2_Vec2;
exports.Vec2 = Vec2_Vec2 = _Vec.Vec2;
var Vec3_Vec3;
exports.Vec3 = Vec3_Vec3 = _Vec2.Vec3;
var Mat22_Mat22;
exports.Mat22 = Mat22_Mat22 = _Mat.Mat22;
var Mat33_Mat33;
exports.Mat33 = Mat33_Mat33 = _Mat2.Mat33;
var Transform_Transform;
exports.Transform = Transform_Transform = _Transform.Transform;
var Rot_Rot;
exports.Rot = Rot_Rot = _Rot.Rot;

var AABB_AABB;

exports.AABB = AABB_AABB = _AABB.AABB;

var Shape_Shape;

exports.Shape = Shape_Shape = _Shape.Shape;
var Fixture_Fixture;
exports.Fixture = Fixture_Fixture = _Fixture.Fixture;
var Body_Body;
exports.Body = Body_Body = _Body.Body;
var Contact_Contact;
exports.Contact = Contact_Contact = _Contact.Contact;
var Joint_Joint;
exports.Joint = Joint_Joint = _Joint.Joint;
var World_World;
exports.World = World_World = _World.World;

var Circle_Circle;

exports.Circle = Circle_Circle = _CircleShape.CircleShape;
var Edge_Edge;
exports.Edge = Edge_Edge = _EdgeShape.EdgeShape;
var Polygon_Polygon;
exports.Polygon = Polygon_Polygon = _PolygonShape.PolygonShape;
var Chain_Chain;
exports.Chain = Chain_Chain = _ChainShape.ChainShape;
var Box_Box;
exports.Box = Box_Box = _BoxShape.BoxShape;

internal_internal.CollidePolygons = _CollidePolygon.CollidePolygons;
var DistanceJoint_DistanceJoint;

exports.DistanceJoint = DistanceJoint_DistanceJoint = _DistanceJoint.DistanceJoint;
var FrictionJoint_FrictionJoint;
exports.FrictionJoint = FrictionJoint_FrictionJoint = _FrictionJoint.FrictionJoint;
var GearJoint_GearJoint;
exports.GearJoint = GearJoint_GearJoint = _GearJoint.GearJoint;
var MotorJoint_MotorJoint;
exports.MotorJoint = MotorJoint_MotorJoint = _MotorJoint.MotorJoint;
var MouseJoint_MouseJoint;
exports.MouseJoint = MouseJoint_MouseJoint = _MouseJoint.MouseJoint;
var PrismaticJoint_PrismaticJoint;
exports.PrismaticJoint = PrismaticJoint_PrismaticJoint = _PrismaticJoint.PrismaticJoint;
var PulleyJoint_PulleyJoint;
exports.PulleyJoint = PulleyJoint_PulleyJoint = _PulleyJoint.PulleyJoint;
var RevoluteJoint_RevoluteJoint;
exports.RevoluteJoint = RevoluteJoint_RevoluteJoint = _RevoluteJoint.RevoluteJoint;
var RopeJoint_RopeJoint;
exports.RopeJoint = RopeJoint_RopeJoint = _RopeJoint.RopeJoint;
var WeldJoint_WeldJoint;
exports.WeldJoint = WeldJoint_WeldJoint = _WeldJoint.WeldJoint;
var WheelJoint_WheelJoint;
exports.WheelJoint = WheelJoint_WheelJoint = _WheelJoint.WheelJoint;

internal_internal.Sweep = _Sweep.Sweep;
internal_internal.stats = _stats.toString;
internal_internal.Manifold = _Manifold.Manifold;
internal_internal.Distance = _Distance.Distance;
internal_internal.TimeOfImpact = _TimeOfImpact.TimeOfImpact;
internal_internal.DynamicTree = _DynamicTree.DynamicTree;
internal_internal.Settings = _Settings.Settings;
exports.internal = internal_internal;
exports.Math = Math_Math;
exports.Vec2 = Vec2_Vec2;
exports.Vec3 = Vec3_Vec3;
exports.Mat22 = Mat22_Mat22;
exports.Mat33 = Mat33_Mat33;
exports.Transform = Transform_Transform;
exports.Rot = Rot_Rot;
exports.AABB = AABB_AABB;
exports.Shape = Shape_Shape;
exports.Fixture = Fixture_Fixture;
exports.Body = Body_Body;
exports.Contact = Contact_Contact;
exports.Joint = Joint_Joint;
exports.World = World_World;
exports.Circle = Circle_Circle;
exports.Edge = Edge_Edge;
exports.Polygon = Polygon_Polygon;
exports.Chain = Chain_Chain;
exports.Box = Box_Box;
exports.DistanceJoint = DistanceJoint_DistanceJoint;
exports.FrictionJoint = FrictionJoint_FrictionJoint;
exports.GearJoint = GearJoint_GearJoint;
exports.MotorJoint = MotorJoint_MotorJoint;
exports.MouseJoint = MouseJoint_MouseJoint;
exports.PrismaticJoint = PrismaticJoint_PrismaticJoint;
exports.PulleyJoint = PulleyJoint_PulleyJoint;
exports.RevoluteJoint = RevoluteJoint_RevoluteJoint;
exports.RopeJoint = RopeJoint_RopeJoint;
exports.WeldJoint = WeldJoint_WeldJoint;
exports.WheelJoint = WheelJoint_WheelJoint;