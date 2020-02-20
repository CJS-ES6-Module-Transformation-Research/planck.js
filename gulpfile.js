import fs from "fs";
import browserify from "browserify";
import gulp from "gulp";
import gutil from "gulp-util";
import uglify from "gulp-uglify";
import header from "gulp-header";
import rename from "gulp-rename";
import transform from "vinyl-transform";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

var pkg = require('./package.json');

gulp.task('default', ['main', 'testbed']);

gulp.task('main', function() {
  var task = browserify({
    entries : [ './lib/index.js' ],
    standalone : 'planck'
  });
  task = task.transform({
    fromString : true,
    compress : false,
    mangle : false,
    output : {
      beautify : true,
      comments : /^((?!Copyright)[\s\S])*$/i
    }
  }, 'uglifyify');
  task = task.bundle();
  task.on('error', function(err) {
    console.log(gutil.colors.red(err.message));
    this.emit('end');
  });
  task = task.pipe(source('planck.js')).pipe(buffer()); // vinylify
  task = task.pipe(header(fs.readFileSync('lib/license.js'), { pkg : pkg }));
  task = task.pipe(gulp.dest('dist'));
  task = task.pipe(rename('planck.min.js'));
  task = task.pipe(uglify({compress: {dead_code: true, global_defs: {DEBUG: false, ASSERT: false}}}));
  task = task.pipe(header(fs.readFileSync('lib/license.js'), { pkg : pkg }));
  task = task.pipe(gulp.dest('dist'));
  return task;
});

gulp.task('testbed', function() {
  var task = browserify({
    entries : [ './testbed/index.js' ],
    standalone : 'planck'
  });
  task = task.transform({
    fromString : true,
    compress : false,
    mangle : false,
    output : {
      beautify : true,
      comments : /license/i
    },
    preserveComments: 'license',
  }, 'uglifyify');
  task = task.bundle();
  task.on('error', function(err) {
    console.log(gutil.colors.red(err.message));
    this.emit('end');
  });
  task = task.pipe(source('planck-with-testbed.js')).pipe(buffer()); // vinylify
  task = task.pipe(header(fs.readFileSync('node_modules/stage-js/lib/license.js'), { pkg : {} }));
  task = task.pipe(header(fs.readFileSync('lib/license.js'), { pkg : pkg }));
  task = task.pipe(gulp.dest('dist'));

  task = task.pipe(rename('planck-with-testbed.min.js'));
  task = task.pipe(uglify({
    compress: {dead_code: true, global_defs: {DEBUG: false, ASSERT: true}},
    output : {comments : 'all'}
  }));
  task = task.pipe(gulp.dest('dist'));
  return task;
});
