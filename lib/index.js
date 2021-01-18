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

exports.internal = mod_internal = {};

exports.Math = mod_Math = _Math.math;
exports.Vec2 = mod_Vec2 = _Vec.Vec2;
exports.Vec3 = mod_Vec3 = _Vec2.Vec3;
exports.Mat22 = mod_Mat22 = _Mat.Mat22;
exports.Mat33 = mod_Mat33 = _Mat2.Mat33;
exports.Transform = mod_Transform = _Transform.Transform;
exports.Rot = mod_Rot = _Rot.Rot;

exports.AABB = mod_AABB = _AABB.AABB;

exports.Shape = mod_Shape = _Shape.Shape;
exports.Fixture = mod_Fixture = _Fixture.Fixture;
exports.Body = mod_Body = _Body.Body;
exports.Contact = mod_Contact = _Contact.Contact;
exports.Joint = mod_Joint = _Joint.Joint;
exports.World = mod_World = _World.World;

exports.Circle = mod_Circle = _CircleShape.CircleShape;
exports.Edge = mod_Edge = _EdgeShape.EdgeShape;
exports.Polygon = mod_Polygon = _PolygonShape.PolygonShape;
exports.Chain = mod_Chain = _ChainShape.ChainShape;
exports.Box = mod_Box = _BoxShape.BoxShape;

mod_internal.CollidePolygons = _CollidePolygon.CollidePolygons;

exports.DistanceJoint = mod_DistanceJoint = _DistanceJoint.DistanceJoint;
exports.FrictionJoint = mod_FrictionJoint = _FrictionJoint.FrictionJoint;
exports.GearJoint = mod_GearJoint = _GearJoint.GearJoint;
exports.MotorJoint = mod_MotorJoint = _MotorJoint.MotorJoint;
exports.MouseJoint = mod_MouseJoint = _MouseJoint.MouseJoint;
exports.PrismaticJoint = mod_PrismaticJoint = _PrismaticJoint.PrismaticJoint;
exports.PulleyJoint = mod_PulleyJoint = _PulleyJoint.PulleyJoint;
exports.RevoluteJoint = mod_RevoluteJoint = _RevoluteJoint.RevoluteJoint;
exports.RopeJoint = mod_RopeJoint = _RopeJoint.RopeJoint;
exports.WeldJoint = mod_WeldJoint = _WeldJoint.WeldJoint;
exports.WheelJoint = mod_WheelJoint = _WheelJoint.WheelJoint;

mod_internal.Sweep = _Sweep.Sweep;
mod_internal.stats = _stats.toString;
mod_internal.Manifold = _Manifold.Manifold;
mod_internal.Distance = _Distance.Distance;
mod_internal.TimeOfImpact = _TimeOfImpact.TimeOfImpact;
mod_internal.DynamicTree = _DynamicTree.DynamicTree;
mod_internal.Settings = _Settings.Settings;
var mod_internal;
exports.internal = mod_internal;

var mod_Math;
exports.Math = mod_Math;

var mod_Vec2;
exports.Vec2 = mod_Vec2;

var mod_Vec3;
exports.Vec3 = mod_Vec3;

var mod_Mat22;
exports.Mat22 = mod_Mat22;

var mod_Mat33;
exports.Mat33 = mod_Mat33;

var mod_Transform;
exports.Transform = mod_Transform;

var mod_Rot;
exports.Rot = mod_Rot;

var mod_AABB;
exports.AABB = mod_AABB;

var mod_Shape;
exports.Shape = mod_Shape;

var mod_Fixture;
exports.Fixture = mod_Fixture;

var mod_Body;
exports.Body = mod_Body;

var mod_Contact;
exports.Contact = mod_Contact;

var mod_Joint;
exports.Joint = mod_Joint;

var mod_World;
exports.World = mod_World;

var mod_Circle;
exports.Circle = mod_Circle;

var mod_Edge;
exports.Edge = mod_Edge;

var mod_Polygon;
exports.Polygon = mod_Polygon;

var mod_Chain;
exports.Chain = mod_Chain;

var mod_Box;
exports.Box = mod_Box;

var mod_DistanceJoint;
exports.DistanceJoint = mod_DistanceJoint;

var mod_FrictionJoint;
exports.FrictionJoint = mod_FrictionJoint;

var mod_GearJoint;
exports.GearJoint = mod_GearJoint;

var mod_MotorJoint;
exports.MotorJoint = mod_MotorJoint;

var mod_MouseJoint;
exports.MouseJoint = mod_MouseJoint;

var mod_PrismaticJoint;
exports.PrismaticJoint = mod_PrismaticJoint;

var mod_PulleyJoint;
exports.PulleyJoint = mod_PulleyJoint;

var mod_RevoluteJoint;
exports.RevoluteJoint = mod_RevoluteJoint;

var mod_RopeJoint;
exports.RopeJoint = mod_RopeJoint;

var mod_WeldJoint;
exports.WeldJoint = mod_WeldJoint;

var mod_WheelJoint;
exports.WheelJoint = mod_WheelJoint;