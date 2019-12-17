Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WheelJoint = exports.WeldJoint = exports.RopeJoint = exports.RevoluteJoint = exports.PulleyJoint = exports.PrismaticJoint = exports.MouseJoint = exports.MotorJoint = exports.GearJoint = exports.FrictionJoint = exports.DistanceJoint = exports.Box = exports.Chain = exports.Polygon = exports.Edge = exports.Circle = exports.World = exports.Joint = exports.Contact = exports.Body = exports.Fixture = exports.Shape = exports.AABB = exports.Rot = exports.Transform = exports.Mat33 = exports.Mat22 = exports.Vec3 = exports.Vec2 = exports.Math = undefined;

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

var toString = _interopRequireWildcard(_stats);

var _Manifold = require("./Manifold");

var _Distance = require("./collision/Distance");

var _TimeOfImpact = require("./collision/TimeOfImpact");

var _DynamicTree = require("./collision/DynamicTree");

var _Settings = require("./Settings");

require("./shape/CollideCircle");

require("./shape/CollideEdgeCircle");

require("./shape/CollideCirclePolygone");

require("./shape/CollideEdgePolygon");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var internal_obj = {};
var Math_obj = _Math.math;
var Vec2_obj = _Vec.Vec2;
var Vec3_obj = _Vec2.Vec3;
var Mat22_obj = _Mat.Mat22;
var Mat33_obj = _Mat2.Mat33;
var Transform_obj = _Transform.Transform;
var Rot_obj = _Rot.Rot;
var AABB_obj = _AABB.AABB;
var Shape_obj = _Shape.Shape;
var Fixture_obj = _Fixture.Fixture;
var Body_obj = _Body.Body;
var Contact_obj = _Contact.Contact;
var Joint_obj = _Joint.Joint;
var World_obj = _World.World;
var Circle_obj = _CircleShape.CircleShape;
var Edge_obj = _EdgeShape.EdgeShape;
var Polygon_obj = _PolygonShape.PolygonShape;
var Chain_obj = _ChainShape.ChainShape;
var Box_obj = _BoxShape.BoxShape;
internal_obj.CollidePolygons = _CollidePolygon.CollidePolygons;
var DistanceJoint_obj = _DistanceJoint.DistanceJoint;
var FrictionJoint_obj = _FrictionJoint.FrictionJoint;
var GearJoint_obj = _GearJoint.GearJoint;
var MotorJoint_obj = _MotorJoint.MotorJoint;
var MouseJoint_obj = _MouseJoint.MouseJoint;
var PrismaticJoint_obj = _PrismaticJoint.PrismaticJoint;
var PulleyJoint_obj = _PulleyJoint.PulleyJoint;
var RevoluteJoint_obj = _RevoluteJoint.RevoluteJoint;
var RopeJoint_obj = _RopeJoint.RopeJoint;
var WeldJoint_obj = _WeldJoint.WeldJoint;
var WheelJoint_obj = _WheelJoint.WheelJoint;

internal_obj.Sweep = _Sweep.Sweep;
internal_obj.stats = toString;
internal_obj.Manifold = _Manifold.Manifold;
internal_obj.Distance = _Distance.Distance;
internal_obj.TimeOfImpact = _TimeOfImpact.TimeOfImpact;
internal_obj.DynamicTree = _DynamicTree.DynamicTree;
internal_obj.Settings = _Settings.Settings;
var exported_CollidePolygons = internal_obj.CollidePolygons = _CollidePolygon.CollidePolygons;
var exported_Sweep = internal_obj.Sweep = _Sweep.Sweep;
var exported_stats = internal_obj.stats = toString;
var exported_Manifold = internal_obj.Manifold = _Manifold.Manifold;
var exported_Distance = internal_obj.Distance = _Distance.Distance;
var exported_TimeOfImpact = internal_obj.TimeOfImpact = _TimeOfImpact.TimeOfImpact;
var exported_DynamicTree = internal_obj.DynamicTree = _DynamicTree.DynamicTree;
var exported_Settings = internal_obj.Settings = _Settings.Settings;
exports.Math = Math_obj;
exports.Vec2 = Vec2_obj;
exports.Vec3 = Vec3_obj;
exports.Mat22 = Mat22_obj;
exports.Mat33 = Mat33_obj;
exports.Transform = Transform_obj;
exports.Rot = Rot_obj;
exports.AABB = AABB_obj;
exports.Shape = Shape_obj;
exports.Fixture = Fixture_obj;
exports.Body = Body_obj;
exports.Contact = Contact_obj;
exports.Joint = Joint_obj;
exports.World = World_obj;
exports.Circle = Circle_obj;
exports.Edge = Edge_obj;
exports.Polygon = Polygon_obj;
exports.Chain = Chain_obj;
exports.Box = Box_obj;
exports.DistanceJoint = DistanceJoint_obj;
exports.FrictionJoint = FrictionJoint_obj;
exports.GearJoint = GearJoint_obj;
exports.MotorJoint = MotorJoint_obj;
exports.MouseJoint = MouseJoint_obj;
exports.PrismaticJoint = PrismaticJoint_obj;
exports.PulleyJoint = PulleyJoint_obj;
exports.RevoluteJoint = RevoluteJoint_obj;
exports.RopeJoint = RopeJoint_obj;
exports.WeldJoint = WeldJoint_obj;
exports.WheelJoint = WheelJoint_obj;
