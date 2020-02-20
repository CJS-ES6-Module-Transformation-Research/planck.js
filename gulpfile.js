var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _browserify = require("browserify");

var _browserify2 = _interopRequireDefault(_browserify);

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _gulpUglify = require("gulp-uglify");

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpHeader = require("gulp-header");

var _gulpHeader2 = _interopRequireDefault(_gulpHeader);

var _gulpRename = require("gulp-rename");

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _vinylTransform = require("vinyl-transform");

var _vinylTransform2 = _interopRequireDefault(_vinylTransform);

var _vinylSourceStream = require("vinyl-source-stream");

var _vinylSourceStream2 = _interopRequireDefault(_vinylSourceStream);

var _vinylBuffer = require("vinyl-buffer");

var _vinylBuffer2 = _interopRequireDefault(_vinylBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('./package.json');

_gulp2.default.task('default', ['main', 'testbed']);

_gulp2.default.task('main', function () {
  var task = (0, _browserify2.default)({
    entries: ['./lib/index.js'],
    standalone: 'planck'
  });
  task = task.transform({
    fromString: true,
    compress: false,
    mangle: false,
    output: {
      beautify: true,
      comments: /^((?!Copyright)[\s\S])*$/i
    }
  }, 'uglifyify');
  task = task.bundle();
  task.on('error', function (err) {
    console.log(_gulpUtil2.default.colors.red(err.message));
    this.emit('end');
  });
  task = task.pipe((0, _vinylSourceStream2.default)('planck.js')).pipe((0, _vinylBuffer2.default)()); // vinylify
  task = task.pipe((0, _gulpHeader2.default)(_fs2.default.readFileSync('lib/license.js'), { pkg: pkg }));
  task = task.pipe(_gulp2.default.dest('dist'));
  task = task.pipe((0, _gulpRename2.default)('planck.min.js'));
  task = task.pipe((0, _gulpUglify2.default)({ compress: { dead_code: true, global_defs: { DEBUG: false, ASSERT: false } } }));
  task = task.pipe((0, _gulpHeader2.default)(_fs2.default.readFileSync('lib/license.js'), { pkg: pkg }));
  task = task.pipe(_gulp2.default.dest('dist'));
  return task;
});

_gulp2.default.task('testbed', function () {
  var task = (0, _browserify2.default)({
    entries: ['./testbed/index.js'],
    standalone: 'planck'
  });
  task = task.transform({
    fromString: true,
    compress: false,
    mangle: false,
    output: {
      beautify: true,
      comments: /license/i
    },
    preserveComments: 'license'
  }, 'uglifyify');
  task = task.bundle();
  task.on('error', function (err) {
    console.log(_gulpUtil2.default.colors.red(err.message));
    this.emit('end');
  });
  task = task.pipe((0, _vinylSourceStream2.default)('planck-with-testbed.js')).pipe((0, _vinylBuffer2.default)()); // vinylify
  task = task.pipe((0, _gulpHeader2.default)(_fs2.default.readFileSync('node_modules/stage-js/lib/license.js'), { pkg: {} }));
  task = task.pipe((0, _gulpHeader2.default)(_fs2.default.readFileSync('lib/license.js'), { pkg: pkg }));
  task = task.pipe(_gulp2.default.dest('dist'));

  task = task.pipe((0, _gulpRename2.default)('planck-with-testbed.min.js'));
  task = task.pipe((0, _gulpUglify2.default)({
    compress: { dead_code: true, global_defs: { DEBUG: false, ASSERT: true } },
    output: { comments: 'all' }
  }));
  task = task.pipe(_gulp2.default.dest('dist'));
  return task;
});
